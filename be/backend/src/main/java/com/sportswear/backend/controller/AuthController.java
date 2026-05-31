package com.sportswear.backend.controller;

import com.sportswear.backend.dto.auth.AuthResponse;
import com.sportswear.backend.dto.auth.LoginRequest;
import com.sportswear.backend.dto.auth.RefreshTokenRequest;
import com.sportswear.backend.dto.auth.RegisterRequest;
import com.sportswear.backend.entity.User;
import com.sportswear.backend.repository.RefreshTokenRepository;
import com.sportswear.backend.service.AuthService;
import com.sportswear.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {
    private final AuthService authService;
    private final UserService userService;
    private final RefreshTokenRepository refreshTokenRepository;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return new ResponseEntity<>(authService.register(request), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.refreshToken(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody RefreshTokenRequest request) {
        refreshTokenRepository.findByToken(request.getRefreshToken())
                .ifPresent(refreshTokenRepository::delete);
        return ResponseEntity.ok("Đăng xuất thành công");
    }

    @GetMapping("/me")
    public ResponseEntity<?> me() {
        User currentUser = userService.getCurrentUser();
        return ResponseEntity.ok(AuthResponse.builder()
                .username(currentUser.getUsername())
                .fullName(currentUser.getFullName())
                .role(currentUser.getRoles().stream()
                        .findFirst()
                        .map(role -> role.getName())
                        .orElse("ROLE_CUSTOMER"))
                .build());
    }
}