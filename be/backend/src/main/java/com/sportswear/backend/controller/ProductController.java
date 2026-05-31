package com.sportswear.backend.controller;

import com.sportswear.backend.dto.product.ProductRequest;
import com.sportswear.backend.dto.product.ProductResponse;
import com.sportswear.backend.dto.product.ProductVariantRequest;
import com.sportswear.backend.dto.product.ProductVariantResponse;
import com.sportswear.backend.entity.ProductVariant;
import com.sportswear.backend.service.ProductService;
import com.sportswear.backend.service.ProductVariantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    private final ProductService productService;
    private final ProductVariantService productVariantService;

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@RequestBody ProductRequest request) {
        ProductResponse response = productService.createProduct(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductResponse>> searchProducts(
            @RequestParam String keyword) {
        return ResponseEntity.ok(productService.searchProducts(keyword));
    }

    @PostMapping("/{id}/variants")
    public ResponseEntity<ProductVariantResponse> addVariant(
            @PathVariable Long id,
            @RequestBody ProductVariantRequest request) {
        return new ResponseEntity<>(
                productVariantService.addVariant(id, request),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{id}/variants")
    public ResponseEntity<List<ProductVariantResponse>> getVariants(@PathVariable Long id) {
        return ResponseEntity.ok(productVariantService.getVariantsByProduct(id));
    }

}