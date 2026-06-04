package com.sportswear.backend.service;

import com.sportswear.backend.dto.product.ProductRequest;
import com.sportswear.backend.dto.product.ProductResponse;
import com.sportswear.backend.entity.Category;
import com.sportswear.backend.entity.Product;
import com.sportswear.backend.exception.ResourceNotFoundException;
import com.sportswear.backend.repository.CategoryRepository;
import com.sportswear.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts() {
        log.debug("Fetching all active products");
        return productRepository.findAll().stream()
                .filter(Product::isActive)
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProductsForAdmin() {
        log.debug("Admin fetching all products");
        return productRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        log.debug("Fetching product by id: {}", id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với ID: " + id));
        return convertToResponse(product);
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        log.info("Creating new product: {}", request.getName());

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy danh mục với ID: " + request.getCategoryId()));

        String slug = generateUniqueSlug(request.getName());

        Product product = Product.builder()
                .name(request.getName())
                .slug(slug)
                .description(request.getDescription())
                .brand(request.getBrand())
                .imageUrl(request.getImageUrl())
                .active(request.isActive())
                .category(category)
                .build();

        Product saved = productRepository.save(product);
        log.info("Product created - id: {}, name: {}, slug: {}", saved.getId(), saved.getName(), slug);
        return convertToResponse(saved);
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        log.info("Updating product id: {}", id);

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy sản phẩm với ID: " + id));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy danh mục với ID: " + request.getCategoryId()));

        if (!product.getName().equals(request.getName())) {
            product.setSlug(generateUniqueSlug(request.getName()));
        }

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setBrand(request.getBrand());
        product.setImageUrl(request.getImageUrl());
        product.setActive(request.isActive());
        product.setCategory(category);

        log.info("Product updated - id: {}", id);
        return convertToResponse(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(Long id) {
        log.info("Soft deleting product id: {}", id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy sản phẩm với ID: " + id));
        product.setActive(false);
        productRepository.save(product);
        log.info("Product deactivated - id: {}", id);
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> searchProducts(String keyword) {
        log.debug("Searching products with keyword: {}", keyword);
        return productRepository.findByNameContainingIgnoreCase(keyword)
                .stream()
                .filter(Product::isActive)
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // ==================== Helper methods ====================

    private ProductResponse convertToResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .description(product.getDescription())
                .brand(product.getBrand())
                .imageUrl(product.getImageUrl())
                .active(product.isActive())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }

    private String generateUniqueSlug(String name) {
        String baseSlug = generateSlug(name);
        if (baseSlug.isEmpty()) {
            baseSlug = "san-pham-" + System.currentTimeMillis();
        }
        String slug = baseSlug;
        int counter = 1;
        while (productRepository.findBySlug(slug).isPresent()) {
            slug = baseSlug + "-" + counter++;
        }
        return slug;
    }

    private String generateSlug(String name) {
        String normalized = Normalizer.normalize(name, Normalizer.Form.NFD);
        String withoutAccents = normalized.replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
        return withoutAccents
                .toLowerCase()
                .trim()
                .replaceAll("[đĐ]", "d")
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
    }
}
