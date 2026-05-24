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

    @NotNull(message = "Giá không được để trống")
    @Positive(message = "Giá phải lớn hơn 0")
    private BigDecimal price;

    private BigDecimal salePrice;

    @NotNull
    @PositiveOrZero(message = "Tồn kho phải >= 0")
    private Integer stockQuantity;

    @NotNull(message = "Danh mục là bắt buộc")
    private Long categoryId;

    private String brand;
    private String gender;
    private String imageUrl;
    private String size;
    private String color;
    private boolean featured = false;
    private boolean active = true;
}
