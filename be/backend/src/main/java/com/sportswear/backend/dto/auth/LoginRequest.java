package com.sportswear.backend.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "Username hoặc Email không được để trống")
    private String usernameOrEmail;

    @NotBlank(message = "Password không được để trống")
    @Size(min = 6, max = 128, message = "Password phải từ 6-128 ký tự")
    private String password;
}
