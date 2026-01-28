package com.insurance.management.service.auth.impl;

import com.insurance.management.dto.request.auth.LoginRequestDTO;
import com.insurance.management.dto.request.auth.RegisterRequestDTO;
import com.insurance.management.dto.response.auth.AuthResponseDTO;
import com.insurance.management.entity.User;
import com.insurance.management.entity.UserRole;
import com.insurance.management.repository.UserRepository;
import com.insurance.management.security.JwtUtils;
import com.insurance.management.security.UserPrincipal;
import com.insurance.management.service.auth.AuthService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;

    @Override
    public AuthResponseDTO login(LoginRequestDTO loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        System.out.println(principal);
        String token = jwtUtils.generateToken(principal);

        return new AuthResponseDTO(
                token,
                principal.getEmail(),
                principal.getAuthorities().stream()
                        .map(auth -> auth.getAuthority())
                        .collect(Collectors.toList()));
    }

    @Override
    public String register(RegisterRequestDTO registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email is already taken!");
        }

        User user = modelMapper.map(registerRequest, User.class);
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        // Default role if not provided or just simple mapping
        if (registerRequest.getRoles() == null || registerRequest.getRoles().isEmpty()) {
            user.setRole(UserRole.ROLE_CUSTOMER);
        } else {
            // Just take the first role for simplicity in this project
            String roleStr = registerRequest.getRoles().iterator().next().toUpperCase();
            if (!roleStr.startsWith("ROLE_")) {
                roleStr = "ROLE_" + roleStr;
            }
            try {
                user.setRole(UserRole.valueOf(roleStr));
            } catch (IllegalArgumentException e) {
                user.setRole(UserRole.ROLE_CUSTOMER);
            }
        }

        userRepository.save(user);
        return "User registered successfully!";
    }
}
