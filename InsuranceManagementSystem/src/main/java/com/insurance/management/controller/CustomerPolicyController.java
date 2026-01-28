package com.insurance.management.controller;

import com.insurance.management.entity.CustomerPolicy;
import com.insurance.management.services.CustomerPolicyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/enrollments")
@RequiredArgsConstructor
public class CustomerPolicyController {

    private final CustomerPolicyService customerPolicyService;

    @PostMapping("/customer/{customerId}/policy/{policyId}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('CUSTOMER', 'AGENT')")
    public ResponseEntity<CustomerPolicy> enroll(@PathVariable Long customerId, @PathVariable Long policyId) {
        return ResponseEntity.ok(customerPolicyService.enrollCustomer(customerId, policyId));
    }

    @GetMapping("/customer/{customerId}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'AGENT', 'CUSTOMER')")
    public ResponseEntity<List<CustomerPolicy>> getByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(customerPolicyService.getPoliciesByCustomer(customerId));
    }

    @PatchMapping("/{id}/status")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CustomerPolicy> updateStatus(@PathVariable Long id,
            @RequestParam CustomerPolicy.PolicyStatus status) {
        return ResponseEntity.ok(customerPolicyService.updateStatus(id, status));
    }
}
