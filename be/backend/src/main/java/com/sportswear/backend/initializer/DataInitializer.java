package com.sportswear.backend.initializer;

import com.sportswear.backend.entity.*;
import com.sportswear.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final OrderStatusRepository orderStatusRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final PaymentStatusRepository paymentStatusRepository;
    private final SizeRepository sizeRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("Khởi tạo dữ liệu mặc định...");

        initRoles();
        initSizes();
        initOrderStatuses();
        initPaymentMethods();
        initPaymentStatuses();

        log.info("Hoàn thành khởi tạo tất cả dữ liệu mặc định.");
    }

    private void initRoles() {
        List<String> defaultRoles = Arrays.asList("ROLE_CUSTOMER", "ROLE_ADMIN", "ROLE_STAFF");
        int count = 0;

        for (String roleName : defaultRoles) {
            if (roleRepository.findByName(roleName).isEmpty()) {
                Role role = Role.builder()
                        .name(roleName)
                        .description("Default role: " + roleName)
                        .build();
                roleRepository.save(role);
                count++;
                log.info("Đã tạo Role: {}", roleName);
            }
        }
        log.info("Hoàn thành Roles - Đã tạo mới: {}", count);
    }

    private void initSizes() {
        List<String> defaultSizes = Arrays.asList("S", "M", "L", "XL", "XXL", "FreeSize");

        int count = 0;
        for (String sizeName : defaultSizes) {
            if (sizeRepository.findByName(sizeName).isEmpty()) {
                Size size = Size.builder()
                        .name(sizeName)
                        .description("Kích cỡ " + sizeName)
                        .build();

                sizeRepository.save(size);
                count++;
                log.info("Đã tạo Size: {}", sizeName);
            }
        }
        log.info("Hoàn thành Sizes - Đã tạo mới: {}", count);
    }

    private void initOrderStatuses() {
        List<String> statuses = Arrays.asList(
                "PENDING", "CONFIRMED", "PROCESSING",
                "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"
        );

        for (String status : statuses) {
            if (orderStatusRepository.findByName(status).isEmpty()) {
                OrderStatus os = OrderStatus.builder()
                        .name(status)
                        .description("Trạng thái đơn hàng: " + status)
                        .build();
                orderStatusRepository.save(os);
                log.info("Đã tạo OrderStatus: {}", status);
            }
        }
    }

    private void initPaymentMethods() {
        List<String> methods = Arrays.asList("COD", "MOMO", "VNPAY", "BANK_TRANSFER");

        for (String method : methods) {
            if (paymentMethodRepository.findByName(method).isEmpty()) {
                PaymentMethod pm = PaymentMethod.builder()
                        .name(method)
                        .description("Phương thức thanh toán: " + method)
                        .build();
                paymentMethodRepository.save(pm);
                log.info("Đã tạo PaymentMethod: {}", method);
            }
        }
    }

    private void initPaymentStatuses() {
        List<String> statuses = Arrays.asList("PENDING", "PAID", "FAILED", "REFUNDED");

        for (String status : statuses) {
            if (paymentStatusRepository.findByName(status).isEmpty()) {
                PaymentStatus ps = PaymentStatus.builder()
                        .name(status)
                        .description("Trạng thái thanh toán: " + status)
                        .build();
                paymentStatusRepository.save(ps);
                log.info("Đã tạo PaymentStatus: {}", status);
            }
        }
    }
}
