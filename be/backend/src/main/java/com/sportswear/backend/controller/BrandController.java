package com.sportswear.backend.controller;

import com.sportswear.backend.entity.Brand;
import com.sportswear.backend.repository.BrandRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/brands")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BrandController {
    private final BrandRepository brandRepository;

    @GetMapping
    public ResponseEntity<List<Brand>> getAllBrands() {
        return ResponseEntity.ok(brandRepository.findByActiveTrue());
    }
}
