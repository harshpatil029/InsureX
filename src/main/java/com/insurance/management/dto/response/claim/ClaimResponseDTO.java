package com.insurance.management.dto.response.claim;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ClaimResponseDTO {
    private Long id;
    private Long customerPolicyId;
    private BigDecimal claimAmount;
    private String description;
    private LocalDate claimDate;
    private String status;
}
