package com.sportswear.backend.service;

import com.sportswear.backend.dto.product.ProductVariantRequest;
import com.sportswear.backend.dto.product.ProductVariantResponse;
import com.sportswear.backend.entity.Product;
import com.sportswear.backend.entity.ProductVariant;
import com.sportswear.backend.entity.Size;
import com.sportswear.backend.exception.ResourceNotFoundException;
import com.sportswear.backend.repository.ProductRepository;
import com.sportswear.backend.repository.ProductVariantRepository;
import com.sportswear.backend.repository.SizeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductVariantService {
    private final ProductVariantRepository variantRepository;
    private final ProductRepository productRepository;
    private final SizeRepository sizeRepository;

    @Transactional
    public ProductVariantResponse addVariant(Long productId, ProductVariantRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Size size = sizeRepository.findById(request.getSizeId())
                .orElseThrow(() -> new ResourceNotFoundException("Size not found"));

        ProductVariant variant = ProductVariant.builder()
                .product(product)
                .size(size)
                .color(request.getColor())
                .price(request.getPrice())
                .stock(request.getStock())
                .build();

        ProductVariant saved = variantRepository.save(variant);

        return ProductVariantResponse.builder()
                .id(saved.getId())
                .color(saved.getColor())
                .sizeName(size.getName())
                .price(saved.getPrice())
                .stock(saved.getStock())
                .build();
    }

    public List<ProductVariantResponse> getVariantsByProduct(Long productId) {
        return variantRepository.findByProductId(productId)
                .stream()
                .map(v -> ProductVariantResponse.builder()
                        .id(v.getId())
                        .color(v.getColor())
                        .sizeName(v.getSize().getName())
                        .price(v.getPrice())
                        .stock(v.getStock())
                        .build())
                .collect(Collectors.toList());
    }
}
