package com.sportswear.backend.dto.order;

import com.sportswear.backend.entity.OrderStatus;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
@Builder
public class AdminOrderResponse {
    private Long orderId;
    private String customerName;
    private String customerEmail;
    private String phoneNumber;
    private String shippingAddress;
    private BigDecimal totalAmount;
    private String status;
    private String paymentMethod;
    private String paymentStatus;
    private LocalDateTime createdAt;
    private List<OrderItemDto> items;
}
