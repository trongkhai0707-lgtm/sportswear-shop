package com.sportswear.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import com.sportswear.backend.dto.auth.*;
import com.sportswear.backend.dto.user.UserProfileResponse;
import com.sportswear.backend.service.AuthService;
import com.sportswear.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@Tag(name = "Authentication", description = "Đăng ký, đăng nhập, refresh token, logout")
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    @Operation(summary = "Đăng ký tài khoản mới",
            description = "Tạo tài khoản CUSTOMER. Username và email phải unique.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Đăng ký thành công, trả về token"),
            @ApiResponse(responseCode = "400", description = "Username/email đã tồn tại hoặc dữ liệu không hợp lệ")
    })
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Registering new user: {}", request.getUsername());
        return new ResponseEntity<>(authService.register(request), HttpStatus.CREATED);
    }

    @Operation(summary = "Đăng nhập",
            description = "Đăng nhập bằng username hoặc email + password. Trả về accessToken và refreshToken.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Đăng nhập thành công"),
            @ApiResponse(responseCode = "401", description = "Sai username/email hoặc password")
    })
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("User login attempt: {}", request.getUsernameOrEmail());
        return ResponseEntity.ok(authService.login(request));
    }

    @Operation(summary = "Làm mới access token",
            description = "Dùng refreshToken để lấy accessToken mới khi accessToken hết hạn.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Token mới"),
            @ApiResponse(responseCode = "400", description = "Refresh token hết hạn hoặc không hợp lệ")
    })
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        log.info("Refreshing token");
        return ResponseEntity.ok(authService.refreshToken(request));
    }

    @Operation(summary = "Đăng xuất", description = "Thu hồi refreshToken.")
    @ApiResponse(responseCode = "200", description = "Đăng xuất thành công")
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@Valid @RequestBody RefreshTokenRequest request) {
        log.info("User logout");
        authService.logout(request.getRefreshToken());
        return ResponseEntity.ok("Đăng xuất thành công");
    }

    @Operation(summary = "Lấy thông tin user hiện tại",
            description = "Trả về profile của user đang đăng nhập dựa trên Bearer token.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Thông tin user"),
            @ApiResponse(responseCode = "401", description = "Chưa đăng nhập")
    })
    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> me() {
        log.info("Fetching current user profile via /me");
        return ResponseEntity.ok(userService.getProfile());
    }
}
