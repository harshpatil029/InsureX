package com.insurance.management.service.auth;

import com.insurance.management.dto.request.auth.LoginRequestDTO;
import com.insurance.management.dto.request.auth.RegisterRequestDTO;
import com.insurance.management.dto.response.auth.AuthResponseDTO;

public interface AuthService {
    AuthResponseDTO login(LoginRequestDTO loginRequest);

    String register(RegisterRequestDTO registerRequest);
}
