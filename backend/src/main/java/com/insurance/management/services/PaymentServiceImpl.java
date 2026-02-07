package com.insurance.management.services;

import com.insurance.management.dto.PaymentRequestDTO;
import com.insurance.management.dto.PaymentResponseDTO;
import com.insurance.management.entity.CustomerPolicy;
import com.insurance.management.entity.Payment;
import com.insurance.management.exception.ResourceNotFoundException;
import com.insurance.management.repository.CustomerPolicyRepository;
import com.insurance.management.repository.PaymentRepository;
import com.insurance.management.services.PaymentService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final CustomerPolicyRepository customerPolicyRepository;
    private final ModelMapper modelMapper;

    @Override
    public PaymentResponseDTO processPayment(PaymentRequestDTO request) {
        CustomerPolicy enrollment = customerPolicyRepository.findById(request.getCustomerPolicyId())
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found"));

        Payment payment = modelMapper.map(request, Payment.class);
        payment.setCustomerPolicy(enrollment);
        payment.setPaymentDate(LocalDateTime.now());
        payment.setStatus(Payment.PaymentStatus.SUCCESS); // Simulating success

        if (request.getTransactionId() == null || request.getTransactionId().isEmpty()) {
            payment.setTransactionId(UUID.randomUUID().toString());
        }

        Payment savedPayment = paymentRepository.save(payment);
        return modelMapper.map(savedPayment, PaymentResponseDTO.class);
    }

    @Override
    public List<PaymentResponseDTO> getPaymentsByEnrollment(Long enrollmentId) {
        return paymentRepository.findByCustomerPolicyId(enrollmentId).stream()
                .map(payment -> modelMapper.map(payment, PaymentResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<PaymentResponseDTO> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(payment -> modelMapper.map(payment, PaymentResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public PaymentResponseDTO processPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        // Simulate processing if pending
        if (payment.getStatus() != Payment.PaymentStatus.SUCCESS) {
            payment.setStatus(Payment.PaymentStatus.SUCCESS);
            if (payment.getTransactionId() == null) {
                payment.setTransactionId(UUID.randomUUID().toString());
            }
            payment = paymentRepository.save(payment);
        }

        return modelMapper.map(payment, PaymentResponseDTO.class);
    }
}
