package com.insurance.management.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class CreatePolicyRequestDTO {
    @NotBlank(message = "Policy name is required")
    private String policyName;

    @NotBlank(message = "Policy description is required")
    private String policyDescription;

    @NotNull(message = "Coverage amount is required")
    private BigDecimal coverageAmount;

    @NotNull(message = "Premium amount is required")
    private BigDecimal premiumAmount;

    @NotNull(message = "Duration is required")
    private Integer durationInMonths;
}
