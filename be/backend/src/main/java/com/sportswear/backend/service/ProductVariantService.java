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
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductVariantService {
    private final ProductVariantRepository variantRepository;
    private final ProductRepository productRepository;
    private final SizeRepository sizeRepository;

    @Transactional
    public ProductVariantResponse addVariant(Long productId, ProductVariantRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productId));

        Size size = sizeRepository.findById(request.getSizeId())
                .orElseThrow(() -> new ResourceNotFoundException("Size not found: " + request.getSizeId()));

        ProductVariant variant = ProductVariant.builder()
                .product(product)
                .size(size)
                .color(request.getColor())
                .price(request.getPrice())
                .stock(request.getStock())
                .build();

        ProductVariant saved = variantRepository.save(variant);
        log.info("Added variant id: {} to product id: {}", saved.getId(), productId);

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ProductVariantResponse> getVariantsByProduct(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product not found: " + productId);
        }
        return variantRepository.findByProductId(productId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductVariantResponse updateVariant(Long variantId, ProductVariantRequest request) {
        ProductVariant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new ResourceNotFoundException("Variant not found: " + variantId));

        Size size = sizeRepository.findById(request.getSizeId())
                .orElseThrow(() -> new ResourceNotFoundException("Size not found: " + request.getSizeId()));

        variant.setSize(size);
        variant.setColor(request.getColor());
        variant.setPrice(request.getPrice());
        variant.setStock(request.getStock());

        return mapToResponse(variantRepository.save(variant));
    }

    @Transactional
    public void deleteVariant(Long variantId) {
        if (!variantRepository.existsById(variantId)) {
            throw new ResourceNotFoundException("Variant not found: " + variantId);
        }
        variantRepository.deleteById(variantId);
        log.info("Deleted variant id: {}", variantId);
    }

    private ProductVariantResponse mapToResponse(ProductVariant v) {
        return ProductVariantResponse.builder()
                .id(v.getId())
                .color(v.getColor())
                .sizeName(v.getSize().getName())
                .price(v.getPrice())
                .stock(v.getStock())
                .build();
    }
}
