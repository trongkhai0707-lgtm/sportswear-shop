package com.sportswear.backend.dto.cart;

import lombok.Data;

@Data
public class CartItemRequest {
    private Long productId;
    private Long variantId;
    private int quantity;
}
