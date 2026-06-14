package com.sportswear.backend.dto.cart;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class CartItemDto {
    private Long itemId;
    private Long productId;
    private String productName;
    private String color;
    private String sizeName;
    private BigDecimal price;
    private int quantity;
    private BigDecimal subtotal;
    private String imageUrl;
}

