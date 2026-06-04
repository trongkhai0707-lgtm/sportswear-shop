package com.sportswear.backend.dto.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import jakarta.validation.constraints.NotNull;

@Data
public class OrderRequest {
    @Valid
    @NotNull(message = "Thông tin giao hàng không được trống")
    private ShippingInfo shippingInfo;

    @NotNull(message = "Phương thức thanh toán không được trống")
    @Positive(message = "Payment Method ID phải là số dương")
    private Long paymentMethodId;
}
