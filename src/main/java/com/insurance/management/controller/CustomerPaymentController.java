package com.insurance.management.controller;

import com.insurance.management.dto.request.payment.PaymentRequestDTO;
import com.insurance.management.dto.response.payment.PaymentResponseDTO;
import com.insurance.management.service.payment.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class CustomerPaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<PaymentResponseDTO> processPayment(@Valid @RequestBody PaymentRequestDTO request) {
        return ResponseEntity.ok(paymentService.processPayment(request));
    }

    @GetMapping("/enrollment/{enrollmentId}")
    public ResponseEntity<List<PaymentResponseDTO>> getByEnrollment(@PathVariable Long enrollmentId) {
        return ResponseEntity.ok(paymentService.getPaymentsByEnrollment(enrollmentId));
    }
}
