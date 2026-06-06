package com.sportswear.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import com.sportswear.backend.dto.product.*;
import com.sportswear.backend.service.ProductService;
import com.sportswear.backend.service.ProductVariantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@Tag(name = "Products", description = "Xem danh sách và chi tiết sản phẩm (public)")
@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    private final ProductService productService;
    private final ProductVariantService productVariantService;

    @Operation(summary = "Lấy tất cả sản phẩm đang active")
    @ApiResponse(responseCode = "200", description = "Danh sách sản phẩm")
    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        log.info("Fetching all products");
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @Operation(summary = "Lấy tất cả sản phẩm theo danh mục")
    @ApiResponse(responseCode = "200", description = "Danh sách sản phẩm")
    @GetMapping("/category/id/{categoryId}")
    public ResponseEntity<List<ProductResponse>> getProductsByCategoryId(
            @Parameter(description = "ID danh mục")
            @PathVariable Long categoryId) {
        log.info("Fetching products by categoryId: {}", categoryId);
        return ResponseEntity.ok(productService.getProductsByCategoryId(categoryId));
    }

    @Operation(summary = "Lấy tất cả sản phẩm theo danh mục")
    @ApiResponse(responseCode = "200", description = "Danh sách sản phẩm")
    @GetMapping("/category/slug/{categorySlug}")
    public ResponseEntity<List<ProductResponse>> getProductsByCategorySlug(
            @Parameter(description = "ID danh mục")
            @PathVariable String categorySlug) {
        log.info("Fetching products by categorySlug: {}", categorySlug);
        return ResponseEntity.ok(productService.getProductsByCategorySlug(categorySlug));
    }

    @Operation(summary = "Lấy chi tiết sản phẩm theo ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Chi tiết sản phẩm"),
            @ApiResponse(responseCode = "404", description = "Không tìm thấy sản phẩm")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(
            @Parameter(description = "ID sản phẩm")
            @PathVariable Long id) {
        log.debug("Fetching product id: {}", id);
        return ResponseEntity.ok(productService.getProductById(id));
    }


    @Operation(summary = "Tìm kiếm sản phẩm theo tên")
    @ApiResponse(responseCode = "200", description = "Danh sách kết quả")
    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request) {
        log.info("Creating new product: {}", request.getName());
        ProductResponse response = productService.createProduct(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductResponse>> searchProducts(
            @Parameter(description = "Từ khoá tìm kiếm", example = "Nike")
            @RequestParam String keyword) {
        log.info("Searching products with keyword: {}", keyword);
        return ResponseEntity.ok(productService.searchProducts(keyword));
    }

    @PostMapping("/{id}/variants")
    public ResponseEntity<ProductVariantResponse> addVariant(
            @PathVariable Long id,
            @Valid @RequestBody ProductVariantRequest request) {
        log.info("Adding variant to product id: {}", id);
        return new ResponseEntity<>(
                productVariantService.addVariant(id, request),
                HttpStatus.CREATED
        );
    }

    @Operation(summary = "Lấy danh sách variants của sản phẩm",
            description = "Trả về tất cả size/màu/giá/tồn kho của một sản phẩm.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Danh sách variants"),
            @ApiResponse(responseCode = "404", description = "Không tìm thấy sản phẩm")
    })
    @GetMapping("/{id}/variants")
    public ResponseEntity<List<ProductVariantResponse>> getVariants(
            @Parameter(description = "ID sản phẩm")
            @PathVariable Long id) {
        return ResponseEntity.ok(productVariantService.getVariantsByProduct(id));
    }
}