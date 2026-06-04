package com.sportswear.backend.controller;

import com.sportswear.backend.dto.user.ChangePasswordRequest;
import com.sportswear.backend.dto.user.UserProfileRequest;
import com.sportswear.backend.dto.user.UserProfileResponse;
import com.sportswear.backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@Tag(name = "User Profile", description = "Quản lý thông tin cá nhân — yêu cầu đăng nhập")
@SecurityRequirement(name = "Bearer Authentication")
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    @Operation(summary = "Xem thông tin profile")
    @ApiResponse(responseCode = "200", description = "Thông tin profile")
    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile() {
        log.info("Lấy thông tin profile người dùng");
        return ResponseEntity.ok(userService.getProfile());
    }

    @Operation(summary = "Cập nhật profile",
            description = "Chỉ cập nhật fullName, phone, address. Không thể đổi username/email ở đây.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Profile sau khi cập nhật"),
            @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ")
    })
    @PutMapping("/profile")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @Valid @RequestBody UserProfileRequest request) {
        log.info("Cập nhật profile người dùng");
        return ResponseEntity.ok(userService.updateProfile(request));
    }

    @Operation(summary = "Đổi mật khẩu",
              description = "Cần nhập mật khẩu hiện tại. Mật khẩu mới phải chứa chữ hoa, chữ thường và số.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Đổi mật khẩu thành công"),
            @ApiResponse(responseCode = "400", description = "Mật khẩu hiện tại sai hoặc mật khẩu mới không khớp")
    })
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @Valid @RequestBody ChangePasswordRequest request) {
        log.info("Yêu cầu đổi mật khẩu");
        userService.changePassword(request);
        return ResponseEntity.ok("Đổi mật khẩu thành công");
    }
}