package com.sportswear.backend.controller;

import com.sportswear.backend.dto.category.CategoryResponse;
import com.sportswear.backend.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@Tag(name = "Categories", description = "Danh mục sản phẩm (public)")
@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CategoryController {

    private final CategoryService categoryService;

    @Operation(summary = "Lấy tất cả danh mục")
    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        log.info("Lấy danh sách tất cả danh mục");
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @Operation(summary = "Lấy chi tiết danh mục theo ID")
    @GetMapping("/id/{id}")
    public ResponseEntity<CategoryResponse> getCategoryById(@PathVariable Long id) {
        log.debug("Lấy chi tiết danh mục id: {}", id);
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    @Operation(summary = "Lấy chi tiết danh mục theo slug")
    @GetMapping("/slug/{slug}")
    public ResponseEntity<CategoryResponse> getCategoryById(@PathVariable String slug) {
        log.debug("Lấy chi tiết danh mục slug: {}", slug);
        return ResponseEntity.ok(categoryService.getCategoryBySlug(slug));
    }
}