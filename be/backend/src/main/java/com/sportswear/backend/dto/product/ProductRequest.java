package com.sportswear.backend.dto.product;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRequest {

    @NotBlank(message = "Tên sản phẩm không được để trống")
    private String name;

    private String description;

    @NotNull
    @Positive
    private BigDecimal price;

    private BigDecimal salePrice;

    @NotNull
    @PositiveOrZero
    private Integer stockQuantity;

    @NotNull(message = "Danh mục là bắt buộc")
    private Long categoryId;

    private String brand;
    private String gender;
    private boolean featured = false;
    private boolean active = true;
}
