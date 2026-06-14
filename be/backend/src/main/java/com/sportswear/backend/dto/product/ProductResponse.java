package com.sportswear.backend.dto.product;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String brand;
    private String imageUrl;
    private boolean active;
    private Long categoryId;
    private String categoryName;
    private BigDecimal minPrice;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
