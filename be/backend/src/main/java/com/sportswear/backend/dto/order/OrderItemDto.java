package com.sportswear.backend.dto.order;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
@Data
public class OrderItemDto {
    private Long productId;
    private String productName;
    private String size;
    private String color;
    private BigDecimal price;
    private int quantity;
    private BigDecimal subtotal;
}
