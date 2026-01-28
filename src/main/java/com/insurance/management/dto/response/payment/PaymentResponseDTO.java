package com.insurance.management.dto.response.payment;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PaymentResponseDTO {
    private Long id;
    private Long customerPolicyId;
    private BigDecimal amount;
    private LocalDateTime paymentDate;
    private String transactionId;
    private String status;
}
