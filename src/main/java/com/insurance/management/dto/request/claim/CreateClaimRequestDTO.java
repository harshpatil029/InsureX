package com.insurance.management.dto.request.claim;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class CreateClaimRequestDTO {
    @NotNull(message = "Customer Policy ID is required")
    private Long customerPolicyId;

    @NotNull(message = "Claim amount is required")
    private BigDecimal claimAmount;

    @NotBlank(message = "Description is required")
    private String description;
}
