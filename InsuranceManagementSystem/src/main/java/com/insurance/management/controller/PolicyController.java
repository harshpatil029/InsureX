package com.insurance.management.controller;

import com.insurance.management.dto.CreatePolicyRequestDTO;
import com.insurance.management.dto.UpdatePolicyRequestDTO;
import com.insurance.management.dto.ApiResponse;
import com.insurance.management.dto.PolicyResponseDTO;
import com.insurance.management.services.PolicyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/policies")
@RequiredArgsConstructor
public class PolicyController {

    private final PolicyService policyService;

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PolicyResponseDTO> createPolicy(@Valid @RequestBody CreatePolicyRequestDTO request) {
        return ResponseEntity.ok(policyService.createPolicy(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PolicyResponseDTO> getPolicy(@PathVariable Long id) {
        return ResponseEntity.ok(policyService.getPolicyById(id));
    }

    @GetMapping
    public ResponseEntity<List<PolicyResponseDTO>> getAllPolicies() {
        return ResponseEntity.ok(policyService.getAllPolicies());
    }

    @PutMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PolicyResponseDTO> updatePolicy(@PathVariable Long id,
            @Valid @RequestBody UpdatePolicyRequestDTO request) {
        return ResponseEntity.ok(policyService.updatePolicy(id, request));
    }

    @DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deletePolicy(@PathVariable Long id) {
        policyService.deletePolicy(id);
        return ResponseEntity.ok(new ApiResponse("Success", "Policy deleted successfully"));
    }
}
