package com.sportswear.backend.controller.admin;

import com.sportswear.backend.dto.product.ProductRequest;
import com.sportswear.backend.dto.product.ProductResponse;
import com.sportswear.backend.dto.product.ProductVariantRequest;
import com.sportswear.backend.dto.product.ProductVariantResponse;
import com.sportswear.backend.service.ProductService;
import com.sportswear.backend.service.ProductVariantService;
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

import java.util.List;

@Slf4j
@Tag(name = "Admin — Products", description = "Quản lý sản phẩm — chỉ ADMIN")
@SecurityRequirement(name = "Bearer Authentication")
@RestController
@RequestMapping("/api/v1/admin/products")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminProductController {

    private final ProductService productService;
    private final ProductVariantService productVariantService;

    @Operation(summary = "Tạo sản phẩm mới")
    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request) {
        log.info("Admin creating product: {}", request.getName());
        return new ResponseEntity<>(productService.createProduct(request), HttpStatus.CREATED);
    }

    @Operation(summary = "Lấy tất cả sản phẩm (bao gồm inactive)")
    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        log.info("Admin fetching all products");
        return ResponseEntity.ok(productService.getAllProductsForAdmin());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        log.debug("Admin fetching product id: {}", id);
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @Operation(summary = "Cập nhật sản phẩm")
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {
        log.info("Admin updating product id: {}", id);
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    @Operation(summary = "Ẩn sản phẩm (soft delete)")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        log.warn("Admin soft-deleting product id: {}", id);
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== Variant management ====================

    @Operation(summary = "Thêm variant cho sản phẩm",
            description = "sizeId lấy từ GET /api/v1/sizes")
    @PostMapping("/{id}/variants")
    public ResponseEntity<ProductVariantResponse> addVariant(
            @PathVariable Long id,
            @Valid @RequestBody ProductVariantRequest request) {
        log.info("Admin adding variant to product id: {}", id);
        return new ResponseEntity<>(productVariantService.addVariant(id, request), HttpStatus.CREATED);
    }

    @GetMapping("/{id}/variants")
    public ResponseEntity<List<ProductVariantResponse>> getVariants(@PathVariable Long id) {
        log.debug("Admin fetching variants for product id: {}", id);
        return ResponseEntity.ok(productVariantService.getVariantsByProduct(id));
    }

    @Operation(summary = "Cập nhật variant")
    @PutMapping("/variants/{variantId}")
    public ResponseEntity<ProductVariantResponse> updateVariant(
            @PathVariable Long variantId,
            @Valid @RequestBody ProductVariantRequest request) {
        log.info("Admin updating variant id: {}", variantId);
        return ResponseEntity.ok(productVariantService.updateVariant(variantId, request));
    }

    @Operation(summary = "Xóa variant")
    @DeleteMapping("/variants/{variantId}")
    public ResponseEntity<Void> deleteVariant(@PathVariable Long variantId) {
        log.warn("Admin deleting variant id: {}", variantId);
        productVariantService.deleteVariant(variantId);
        return ResponseEntity.noContent().build();
    }
}
