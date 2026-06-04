package com.sportswear.backend.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Sportswear Shop API")
                        .description("REST API cho ứng dụng bán đồ thể thao. " +
                                "Dùng nút **Authorize** để nhập Bearer token trước khi gọi các API cần xác thực.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Sportswear Dev Team")
                                .email("admin@sportswear.com")))
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                .components(new Components()
                        .addSecuritySchemes("Bearer Authentication",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Nhập JWT access token. " +
                                                "Lấy token từ POST /api/v1/auth/login")));
    }
}
