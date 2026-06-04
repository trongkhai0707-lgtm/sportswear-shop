package com.sportswear.backend.dto.order;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponse {
    private Long orderId;
    private String status;
    private BigDecimal totalAmount;
    private ShippingInfo shippingInfo;
    private String paymentMethod;
    private String paymentStatus;
    private LocalDateTime createdAt;
    private List<OrderItemDto> items;
}
