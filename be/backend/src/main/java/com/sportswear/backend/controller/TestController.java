package com.sportswear.backend.controller;


import com.sportswear.backend.dto.response.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/test")
public class TestController {

    @GetMapping
    public ApiResponse<String> testApi() {
        return ApiResponse.success("Backend dự án Sportwear đang chạy tốt!", "Kiểm tra thành công");
    }

    @GetMapping("/hello")
    public ApiResponse<String> hello() {
        return ApiResponse.success("Xin chào! Đây là ngày thứ 9 của dự án.", "Hello từ backend");
    }
}