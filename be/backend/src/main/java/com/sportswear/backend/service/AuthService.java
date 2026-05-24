package com.sportswear.backend.service;

import com.sportswear.backend.dto.auth.AuthResponse;
import com.sportswear.backend.dto.auth.LoginRequest;
import com.sportswear.backend.dto.auth.RefreshTokenRequest;
import com.sportswear.backend.dto.auth.RegisterRequest;
import com.sportswear.backend.entity.RefreshToken;
import com.sportswear.backend.entity.Role;
import com.sportswear.backend.entity.User;
import com.sportswear.backend.repository.RefreshTokenRepository;
import com.sportswear.backend.repository.RoleRepository;
import com.sportswear.backend.repository.UserRepository;
import com.sportswear.backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username đã tồn tại");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }

        Role customerRole = roleRepository.findByName("ROLE_CUSTOMER")
                .orElseThrow(() -> new RuntimeException("Role CUSTOMER không tồn tại"));

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .address(request.getAddress())
                .enabled(true)
                .build();

        user.addRole(customerRole);
        user = userRepository.save(user);

        String accessToken = jwtTokenProvider.generateToken(user.getUsername(), customerRole.getName());
        String refreshTokenStr = createRefreshToken(user);

        return AuthResponse.builder()
                .token(accessToken)
                .refreshToken(refreshTokenStr)
                .username(user.getUsername())
                .role(customerRole.getName())
                .fullName(user.getFullName())
                .build();
    }
    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsernameOrEmail(), request.getPassword())
        );

        User user = (User) authentication.getPrincipal();
        String role = user.getRoles().stream().findFirst()
                .map(Role::getName).orElse("ROLE_CUSTOMER");

        String accessToken = jwtTokenProvider.generateToken(user.getUsername(), role);
        String refreshTokenStr = createRefreshToken(user);

        return AuthResponse.builder()
                .token(accessToken)
                .refreshToken(refreshTokenStr)
                .username(user.getUsername())
                .role(role)
                .fullName(user.getFullName())
                .build();
    }

    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new RuntimeException("Refresh token không hợp lệ"));

        if (refreshToken.isRevoked() || refreshToken.getExpiryDate().isBefore(Instant.now())) {
            throw new RuntimeException("Refresh token đã hết hạn hoặc bị thu hồi");
        }

        User user = refreshToken.getUser();
        String role = user.getRoles().stream().findFirst()
                .map(Role::getName).orElse("ROLE_CUSTOMER");

        String newAccessToken = jwtTokenProvider.generateToken(user.getUsername(), role);

        return AuthResponse.builder()
                .token(newAccessToken)
                .refreshToken(request.getRefreshToken())
                .username(user.getUsername())
                .role(role)
                .fullName(user.getFullName())
                .build();
    }

    private String createRefreshToken(User user) {
        refreshTokenRepository.deleteByUserId(user.getId());

        String token = UUID.randomUUID().toString();
        RefreshToken refreshToken = RefreshToken.builder()
                .token(token)
                .user(user)
                .expiryDate(Instant.now().plusMillis(604800000)) // 7 ngày
                .build();

        refreshTokenRepository.save(refreshToken);
        return token;
    }
}