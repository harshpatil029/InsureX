package com.insurance.management.services;

import com.insurance.management.dto.PaymentRequestDTO;
import com.insurance.management.dto.PaymentResponseDTO;
import java.util.List;

public interface PaymentService {
    PaymentResponseDTO processPayment(PaymentRequestDTO request);

    List<PaymentResponseDTO> getPaymentsByEnrollment(Long enrollmentId);

    List<PaymentResponseDTO> getAllPayments();

    PaymentResponseDTO processPaymentById(Long id);
}
