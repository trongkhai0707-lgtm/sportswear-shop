package com.sportswear.backend.dto.cart;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class CartResponse {
    private Long cartId;
    private List<CartItemDto> items;
    private BigDecimal totalAmount;
    private int totalItems;
}
