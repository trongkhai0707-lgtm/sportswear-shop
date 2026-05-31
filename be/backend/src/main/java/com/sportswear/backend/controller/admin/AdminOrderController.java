package com.sportswear.backend.controller.admin;

import com.sportswear.backend.dto.order.AdminOrderResponse;
import com.sportswear.backend.entity.OrderStatus;
import com.sportswear.backend.service.OrderService;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/orders")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminOrderController {
    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<List<AdminOrderResponse>> getAllOrders(
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(orderService.getAllOrders(status));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<AdminOrderResponse> getOrderDetail(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getOrderDetailForAdmin(orderId));
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<AdminOrderResponse> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }
}
