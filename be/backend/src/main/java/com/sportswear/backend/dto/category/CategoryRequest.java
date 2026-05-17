package com.sportswear.backend.dto.category;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryRequest {
    @NotBlank(message = "Tên danh mục không được để trống")
    @Size(min = 2, max = 100)
    private String name;

    private String description;
    private boolean active = true;
}
