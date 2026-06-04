package com.sportswear.backend.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ChangePasswordRequest {
    @NotBlank(message = "Mật khẩu hiện tại không được trống")
    private String currentPassword;

    @NotBlank(message = "Mật khẩu mới không được trống")

    @Size(min = 6, max = 128, message = "Mật khẩu mới phải từ 6-128 ký tự")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$",
            message = "Mật khẩu mới phải chứa chữ hoa, chữ thường và số")
    private String newPassword;

    @NotBlank(message = "Xác nhận mật khẩu không được trống")
    private String confirmPassword;
}
