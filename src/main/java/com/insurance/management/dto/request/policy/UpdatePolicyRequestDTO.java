package com.insurance.management.dto.request.policy;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class UpdatePolicyRequestDTO {
    private String policyName;
    private String policyDescription;
    private BigDecimal coverageAmount;
    private BigDecimal premiumAmount;
    private Integer durationInMonths;
}
