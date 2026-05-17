package com.sportswear.backend.dto.auth;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
@Data
public class RefreshTokenRequest {
    @NotBlank(message = "Refresh token không được để trống")
    private String refreshToken;
}
