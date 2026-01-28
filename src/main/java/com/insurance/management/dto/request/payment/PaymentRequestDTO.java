package com.insurance.management.dto.request.payment;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class PaymentRequestDTO {
    @NotNull(message = "Customer Policy ID is required")
    private Long customerPolicyId;

    @NotNull(message = "Amount is required")
    private BigDecimal amount;

    private String transactionId;
}
