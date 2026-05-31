package com.sportswear.backend.dto.user;

import lombok.Data;

@Data
public class UserProfileRequest {
    private String fullName;
    private String phone;
    private String address;
}
