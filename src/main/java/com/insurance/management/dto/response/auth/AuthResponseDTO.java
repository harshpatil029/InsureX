package com.insurance.management.dto.response.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class AuthResponseDTO {
    private String token;
    private String username;
    private List<String> roles;
}
