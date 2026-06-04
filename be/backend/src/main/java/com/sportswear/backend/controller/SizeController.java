package com.sportswear.backend.controller;

import com.sportswear.backend.entity.Size;
import com.sportswear.backend.repository.SizeRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@Tag(name = "Sizes", description = "Kích cỡ sản phẩm (public) — dùng khi tạo variant")
@RestController
@RequestMapping("/api/v1/sizes")
@RequiredArgsConstructor
public class SizeController {
    private final SizeRepository sizeRepository;

    @Operation(summary = "Lấy tất cả kích cỡ",
            description = "Trả về id và name (S, M, L, XL, XXL, FreeSize). " +
                    "Dùng id này khi gọi POST /admin/products/{id}/variants")
    @GetMapping
    public ResponseEntity<List<Size>> getAllSizes() {
        log.debug("Fetching all sizes");
        return ResponseEntity.ok(sizeRepository.findAll());
    }
}
