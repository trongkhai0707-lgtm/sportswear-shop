package com.sportswear.backend.controller.admin;

import com.sportswear.backend.dto.order.AdminOrderResponse;
import com.sportswear.backend.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@Tag(name = "Admin — Orders", description = "Quản lý đơn hàng — chỉ ADMIN")
@SecurityRequirement(name = "Bearer Authentication")
@RestController
@RequestMapping("/api/v1/admin/orders")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminOrderController {

    private final OrderService orderService;

    @Operation(summary = "Lấy tất cả đơn hàng",
            description = "Filter theo status: PENDING | CONFIRMED | PROCESSING | SHIPPED | DELIVERED | CANCELLED | REFUNDED")
    @GetMapping
    public ResponseEntity<List<AdminOrderResponse>> getAllOrders(
            @RequestParam(required = false) String status) {
        log.info("Admin lấy tất cả đơn hàng, status filter: {}", status);
        return ResponseEntity.ok(orderService.getAllOrders(status));
    }

    @Operation(summary = "Xem chi tiết đơn hàng")
    @GetMapping("/{orderId}")
    public ResponseEntity<AdminOrderResponse> getOrderDetail(@PathVariable Long orderId) {
        log.info("Admin xem chi tiết đơn hàng id: {}", orderId);
        return ResponseEntity.ok(orderService.getOrderDetailForAdmin(orderId));
    }

    @Operation(summary = "Cập nhật trạng thái đơn hàng",
            description = "status param: PENDING | CONFIRMED | PROCESSING | SHIPPED | DELIVERED | CANCELLED | REFUNDED")
    @PutMapping("/{orderId}/status")
    public ResponseEntity<AdminOrderResponse> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status) {
        log.info("Admin cập nhật status đơn hàng {} thành {}", orderId, status);
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }

    @Operation(summary = "Cập nhật trạng thái thanh toán",
            description = "status param: PENDING | PAID | FAILED | REFUNDED")
    @PutMapping("/{orderId}/payment-status")
    public ResponseEntity<AdminOrderResponse> updatePaymentStatus(
            @PathVariable Long orderId,
            @RequestParam String status) {
        log.info("Admin cập nhật payment status đơn hàng {} thành {}", orderId, status);
        return ResponseEntity.ok(orderService.updatePaymentStatus(orderId, status));
    }
}
