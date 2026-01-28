package com.insurance.management.service.payment;

import com.insurance.management.dto.request.payment.PaymentRequestDTO;
import com.insurance.management.dto.response.payment.PaymentResponseDTO;
import java.util.List;

public interface PaymentService {
    PaymentResponseDTO processPayment(PaymentRequestDTO request);

    List<PaymentResponseDTO> getPaymentsByEnrollment(Long enrollmentId);
}
