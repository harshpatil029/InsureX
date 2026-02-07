package com.insurance.management.services;

import com.insurance.management.dto.LoginRequestDTO;
import com.insurance.management.dto.RegisterRequestDTO;
import com.insurance.management.dto.AuthResponseDTO;

public interface AuthService {
    AuthResponseDTO login(LoginRequestDTO loginRequest);

    String register(RegisterRequestDTO registerRequest);
}
