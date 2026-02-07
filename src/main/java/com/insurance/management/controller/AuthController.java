package com.insurance.management.controller;

import com.insurance.management.dto.request.auth.LoginRequestDTO;
import com.insurance.management.dto.request.auth.RegisterRequestDTO;
import com.insurance.management.dto.response.ApiResponse;
import com.insurance.management.dto.response.auth.AuthResponseDTO;
import com.insurance.management.service.auth.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequestDTO loginRequest) {
        System.out.println("/login called");
        AuthResponseDTO response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequestDTO registerRequest) {
        System.out.println("/register called");
        String response = authService.register(registerRequest);
        return ResponseEntity.ok(new ApiResponse("Success", response));
    }
}
