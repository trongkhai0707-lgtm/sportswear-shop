package com.sportswear.backend.controller;

import com.sportswear.backend.dto.order.OrderRequest;
import com.sportswear.backend.dto.order.OrderResponse;
import com.sportswear.backend.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@Tag(name = "Orders", description = "Đặt hàng và theo dõi đơn — yêu cầu đăng nhập")
@SecurityRequirement(name = "Bearer Authentication")
@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class OrderController {

    private final OrderService orderService;

    @Operation(summary = "Checkout — Tạo đơn hàng từ giỏ hàng",
            description = "Trừ tồn kho, xóa giỏ hàng, trả về đơn hàng mới. " +
                    "paymentMethodId: 1=COD, 2=MOMO, 3=VNPAY, 4=BANK_TRANSFER")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Đơn hàng tạo thành công"),
            @ApiResponse(responseCode = "400", description = "Giỏ hàng rỗng hoặc hết hàng"),
            @ApiResponse(responseCode = "404", description = "Payment method không tồn tại")
    })
    @PostMapping("/checkout")
    public ResponseEntity<OrderResponse> checkout(@Valid @RequestBody OrderRequest request) {
        log.info("User thực hiện checkout");
        return ResponseEntity.ok(orderService.checkout(request));
    }

    @Operation(summary = "Lấy danh sách đơn hàng của tôi",
            description = "Sắp xếp theo thời gian tạo mới nhất trước.")
    @ApiResponse(responseCode = "200", description = "Danh sách đơn hàng")
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getMyOrders() {
        log.info("Lấy danh sách đơn hàng của user");
        return ResponseEntity.ok(orderService.getMyOrders());
    }

    @Operation(summary = "Xem chi tiết một đơn hàng")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Chi tiết đơn hàng"),
            @ApiResponse(responseCode = "403", description = "Không phải đơn hàng của bạn"),
            @ApiResponse(responseCode = "404", description = "Đơn hàng không tồn tại")
    })
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrderDetail(
            @Parameter(description = "ID đơn hàng")
            @PathVariable Long orderId) {
        log.info("Lấy chi tiết đơn hàng id: {}", orderId);
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }

    @Operation(summary = "Hủy đơn hàng",
            description = "Chỉ hủy được khi trạng thái là PENDING. Tồn kho sẽ được hoàn lại.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Hủy thành công"),
            @ApiResponse(responseCode = "400", description = "Đơn không ở trạng thái PENDING")
    })
    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(
            @Parameter(description = "ID đơn hàng")
            @PathVariable Long orderId) {
        log.warn("User yêu cầu hủy đơn hàng id: {}", orderId);
        return ResponseEntity.ok(orderService.cancelOrder(orderId));
    }
}