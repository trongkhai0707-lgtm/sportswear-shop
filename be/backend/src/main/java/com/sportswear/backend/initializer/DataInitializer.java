package com.sportswear.backend.initializer;

import com.sportswear.backend.entity.Role;
import com.sportswear.backend.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j

public class DataInitializer implements CommandLineRunner {
    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        log.info("Bắt đầu khởi tạo dữ liệu mặc định...");

        // Danh sách Role mặc định
        List<String> defaultRoles = Arrays.asList(
                "ROLE_CUSTOMER",
                "ROLE_ADMIN",
                "ROLE_STAFF"
        );

        int createdCount = 0;

        for (String roleName : defaultRoles) {
            // Kiểm tra Role đã tồn tại chưa
            if (roleRepository.findByName(roleName).isEmpty()) {
                Role role = Role.builder()
                        .name(roleName)
                        .description("Default role: " + roleName)
                        .build();

                roleRepository.save(role);
                createdCount++;
                log.info("Đã tạo Role: {}", roleName);
            } else {
                log.info("Role {} đã tồn tại, bỏ qua.", roleName);
            }
        }

        log.info("Hoàn thành khởi tạo dữ liệu. Đã tạo mới {} Role.", createdCount);
    }
}
