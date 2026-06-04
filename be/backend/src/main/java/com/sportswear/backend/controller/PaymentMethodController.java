package com.sportswear.backend.controller;

import com.sportswear.backend.entity.PaymentMethod;
import com.sportswear.backend.repository.PaymentMethodRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@Tag(name = "Payment Methods", description = "Phương thức thanh toán (public) — dùng khi checkout")
@RestController
@RequestMapping("/api/v1/payment-methods")
@RequiredArgsConstructor
public class PaymentMethodController {
    private final PaymentMethodRepository paymentMethodRepository;

    @Operation(summary = "Lấy tất cả phương thức thanh toán",
            description = "Trả về id và name (COD, MOMO, VNPAY, BANK_TRANSFER). " +
                    "Dùng id này khi gọi POST /orders/checkout")
    @GetMapping
    public ResponseEntity<List<PaymentMethod>> getAllPaymentMethods() {
        log.debug("Fetching all payment methods");
        return ResponseEntity.ok(paymentMethodRepository.findAll());
    }
}
