package com.sportswear.backend.controller.admin;

import com.sportswear.backend.dto.category.CategoryRequest;
import com.sportswear.backend.dto.category.CategoryResponse;
import com.sportswear.backend.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@Tag(name = "Admin — Categories", description = "Quản lý danh mục — chỉ ADMIN")
@SecurityRequirement(name = "Bearer Authentication")
@RestController
@RequestMapping("/api/v1/admin/categories")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminCategoryController {

    private final CategoryService categoryService;

    @Operation(summary = "Tạo danh mục mới")
    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(
            @Valid @RequestBody CategoryRequest request) {
        log.info("Admin tạo danh mục mới: {}", request.getName());
        return new ResponseEntity<>(
                categoryService.createCategory(request),
                HttpStatus.CREATED
        );
    }

    @Operation(summary = "Cập nhật danh mục")
    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponse> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request) {
        log.info("Admin cập nhật danh mục id: {}", id);
        return ResponseEntity.ok(categoryService.updateCategory(id, request));
    }

    @Operation(summary = "Ẩn danh mục (soft delete)",
            description = "Sẽ báo lỗi nếu danh mục còn sản phẩm đang active.")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        log.warn("Admin xóa danh mục id: {}", id);
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}