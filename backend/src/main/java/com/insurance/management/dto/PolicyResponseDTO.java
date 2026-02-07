package com.insurance.management.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class PolicyResponseDTO {
    private Long id;
    private String policyName;
    private String policyDescription;
    private BigDecimal coverageAmount;
    private BigDecimal premiumAmount;
    private Integer durationInMonths;
}
