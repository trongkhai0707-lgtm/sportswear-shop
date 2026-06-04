package com.sportswear.backend.dto.auth;

import jakarta.validation.constraints.Size;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;
@Data
public class RefreshTokenRequest {
    @NotBlank(message = "Refresh token không được để trống")
    @Size(min = 10, message = "Refresh token không hợp lệ")
    private String refreshToken;
}
