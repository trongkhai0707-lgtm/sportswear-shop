package com.sportswear.backend.dto.order;

import com.sportswear.backend.entity.OrderStatus;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import com.sportswear.backend.dto.order.ShippingInfo;

@Data
public class OrderResponse {
    private Long orderId;
    private String status;
    private BigDecimal totalAmount;
    private ShippingInfo shippingInfo;
    private LocalDateTime createdAt;
    private List<OrderItemDto> items;
}

