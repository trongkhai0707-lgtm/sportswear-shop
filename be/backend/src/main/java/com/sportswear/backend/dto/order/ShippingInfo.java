package com.sportswear.backend.dto.order;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ShippingInfo {
    @NotBlank(message = "Họ tên không được trống")
    private String fullName;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^(0[3|5|7|8|9])+([0-9]{8})\\b$", message = "Số điện thoại không hợp lệ")
    private String phone;

    @NotBlank(message = "Địa chỉ giao hàng không được để trống")
    @Size(min = 10, max = 255, message = "Địa chỉ phải từ 10-255 ký tự")
    private String address;

    @Size(max = 500, message = "Ghi chú tối đa 500 ký tự")
    private String note;
}