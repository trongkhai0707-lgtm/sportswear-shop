package com.sportswear.backend.service;

import com.sportswear.backend.dto.category.CategoryRequest;
import com.sportswear.backend.dto.category.CategoryResponse;
import com.sportswear.backend.entity.Category;
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
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    // Lấy tất cả danh mục
    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Lấy danh mục theo ID
    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục với ID: " + id));
        return convertToResponse(category);
    }

    // Tạo danh mục mới
    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        String slug = generateUniqueSlug(request.getName(), null);
        Category category = Category.builder()
                .name(request.getName())
                .slug(slug)
                .description(request.getDescription())
                .active(request.isActive())
                .build();
        return convertToResponse(categoryRepository.save(category));
    }

    // Cập nhật danh mục
    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với ID: " + id));

        if (!category.getName().equals(request.getName())) {
            category.setSlug(generateUniqueSlug(request.getName(), id));
        }
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setActive(request.isActive());

        return convertToResponse(categoryRepository.save(category));
    }

    // Xóa danh mục
    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với ID: " + id));

        List<?> products = productRepository.findByCategoryIdAndActiveTrue(id);
        if (!products.isEmpty()) {
            throw new IllegalStateException(
                    "Không thể xóa danh mục vì có " + products.size() +
                            " sản phẩm đang dùng. Hãy chuyển hoặc ẩn các sản phẩm trước."
            );
        }

        // Soft delete - safer than hard delete
        category.setActive(false);
        categoryRepository.save(category);
        log.info("Category soft-deleted id: {}", id);
    }

    // Helper method chuyển Entity → Response
    private CategoryResponse convertToResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .description(category.getDescription())
                .active(category.isActive())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }

    // Tạo slug đơn giản
    private String generateUniqueSlug(String name, Long excludeId) {
        String baseSlug = generateSlug(name);
        if (baseSlug.isEmpty()) {
            baseSlug = "danh-muc-" + System.currentTimeMillis();
        }
        String slug = baseSlug;
        int counter = 1;
        while (true) {
            Optional<Category> existing = categoryRepository.findBySlug(slug);
            if (existing.isEmpty() || (excludeId != null && existing.get().getId().equals(excludeId))) {
                break;
            }
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
