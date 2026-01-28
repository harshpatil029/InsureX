package com.insurance.management.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class UpdateCustomerRequestDTO {
    private String firstName;
    private String lastName;
    private String phone;
    private String address;
    private LocalDate dateOfBirth;
}
