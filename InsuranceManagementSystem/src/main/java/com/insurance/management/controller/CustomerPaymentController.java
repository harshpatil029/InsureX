package com.insurance.management.controller;

import com.insurance.management.dto.PaymentRequestDTO;
import com.insurance.management.dto.PaymentResponseDTO;
import com.insurance.management.services.PaymentService;
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
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<PaymentResponseDTO> processPayment(@Valid @RequestBody PaymentRequestDTO request) {
        return ResponseEntity.ok(paymentService.processPayment(request));
    }

    @GetMapping("/enrollment/{enrollmentId}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
    public ResponseEntity<List<PaymentResponseDTO>> getByEnrollment(@PathVariable Long enrollmentId) {
        return ResponseEntity.ok(paymentService.getPaymentsByEnrollment(enrollmentId));
    }

    @GetMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'AGENT')")
    public ResponseEntity<List<PaymentResponseDTO>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @PostMapping("/{id}/process")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'AGENT')")
    public ResponseEntity<PaymentResponseDTO> processPaymentById(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.processPaymentById(id));
    }
}
