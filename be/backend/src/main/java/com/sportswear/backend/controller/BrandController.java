package com.sportswear.backend.controller;

import com.sportswear.backend.dto.brand.BrandResponse;
import com.sportswear.backend.entity.Brand;
import com.sportswear.backend.repository.BrandRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Tag(name = "Brands", description = "Thương hiệu sản phẩm (public)")
@RestController
@RequestMapping("/api/v1/brands")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BrandController {

    private final BrandRepository brandRepository;

    @Operation(summary = "Lấy tất cả thương hiệu đang active")
    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<BrandResponse>> getAllBrands() {
        log.info("Lấy danh sách tất cả brands");
        List<BrandResponse> brands = brandRepository.findByActiveTrue()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(brands);
    }

    private BrandResponse mapToResponse(Brand brand) {
        return BrandResponse.builder()
                .id(brand.getId())
                .name(brand.getName())
                .description(brand.getDescription())
                .logoUrl(brand.getLogoUrl())
                .active(brand.isActive())
                .createdAt(brand.getCreatedAt())
                .updatedAt(brand.getUpdatedAt())
                .build();
    }
}
