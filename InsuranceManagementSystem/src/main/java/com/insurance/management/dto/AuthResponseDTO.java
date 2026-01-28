package com.insurance.management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class AuthResponseDTO {
    private Long id;
    private String token;
    private String email;
    private List<String> roles;
}
