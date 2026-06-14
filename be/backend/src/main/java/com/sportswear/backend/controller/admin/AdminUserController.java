package com.sportswear.backend.controller.admin;

import com.sportswear.backend.dto.user.UserProfileResponse;
import com.sportswear.backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@Tag(name = "Admin — Users", description = "Quản lý người dùng — chỉ ADMIN")
@SecurityRequirement(name = "Bearer Authentication")
@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminUserController {

    private final UserService userService;

    @Operation(summary = "Lấy tất cả người dùng")
    @GetMapping
    public ResponseEntity<List<UserProfileResponse>> getAllUsers() {
        log.info("Admin lấy danh sách tất cả users");
        return ResponseEntity.ok(userService.getAllUsers());
    }
}