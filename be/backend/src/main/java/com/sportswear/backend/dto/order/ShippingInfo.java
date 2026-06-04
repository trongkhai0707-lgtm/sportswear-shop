package com.sportswear.backend.dto.order;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ShippingInfo {
    @NotBlank(message = "Họ tên không được trống")
    @Size(max = 100, message = "Họ tên không được vượt quá 100 ký tự")
    private String fullName;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^(0[35789])[0-9]{8}$", message = "Số điện thoại không hợp lệ (phải gồm 10 số và đúng đầu số nhà mạng VN)")
    private String phone;

    @NotBlank(message = "Địa chỉ giao hàng không được để trống")
    @Size(min = 10, max = 255, message = "Địa chỉ phải từ 10-255 ký tự")
    private String address;

    @Size(max = 500, message = "Ghi chú tối đa 500 ký tự")
    private String note;
}