package com.sportswear.backend.controller;

import com.sportswear.backend.dto.user.ChangePasswordRequest;
import com.sportswear.backend.dto.user.UserProfileRequest;
import com.sportswear.backend.dto.user.UserProfileResponse;
import com.sportswear.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {
    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile() {
        return ResponseEntity.ok(userService.getProfile());
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @RequestBody UserProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(request));
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(request);
        return ResponseEntity.ok("Đổi mật khẩu thành công");
    }
}
