package com.insurance.management.controller;

import com.insurance.management.dto.LoginRequestDTO;
import com.insurance.management.dto.RegisterRequestDTO;
import com.insurance.management.dto.ApiResponse;
import com.insurance.management.dto.AuthResponseDTO;
import com.insurance.management.services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequestDTO loginRequest) {
        AuthResponseDTO response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequestDTO registerRequest) {
        String response = authService.register(registerRequest);
        return ResponseEntity.ok(new ApiResponse("Success", response));
    }
}
