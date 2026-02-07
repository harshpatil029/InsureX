package com.insurance.management.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class CustomerResponseDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    private LocalDate dateOfBirth;
    private Long userId;
}
