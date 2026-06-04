package com.sportswear.backend.dto.product;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductVariantRequest {
    @NotBlank(message = "Màu sắc không được trống")
    @Size(max = 50, message = "Tên màu không được vượt quá 50 ký tự")
    private String color;

    @NotNull(message = "Size không được trống")
    private Long sizeId;

    @NotNull(message = "Giá không được trống")
    @Positive(message = "Giá phải lớn hơn 0")
    private BigDecimal price;

    @NotNull(message = "Tồn kho không được trống")
    @PositiveOrZero(message = "Tồn kho phải >= 0")
    private Integer stock;
}
