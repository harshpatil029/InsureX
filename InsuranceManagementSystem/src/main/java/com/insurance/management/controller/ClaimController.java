package com.insurance.management.controller;

import com.insurance.management.dto.CreateClaimRequestDTO;
import com.insurance.management.dto.ClaimResponseDTO;
import com.insurance.management.services.ClaimService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/claims")
@RequiredArgsConstructor
public class ClaimController {

    private final ClaimService claimService;

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ClaimResponseDTO> createClaim(@Valid @RequestBody CreateClaimRequestDTO request) {
        return ResponseEntity.ok(claimService.createClaim(request));
    }

    @PatchMapping("/{id}/status")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ClaimResponseDTO> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(claimService.updateClaimStatus(id, status));
    }

    @GetMapping("/enrollment/{enrollmentId}")
    public ResponseEntity<List<ClaimResponseDTO>> getByEnrollment(@PathVariable Long enrollmentId) {
        // Validation of ownership should ideally happen in service, but for now this is
        // open to auth users
        return ResponseEntity.ok(claimService.getClaimsByEnrollment(enrollmentId));
    }

    @GetMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'AGENT')")
    public ResponseEntity<List<ClaimResponseDTO>> getAllClaims() {
        return ResponseEntity.ok(claimService.getAllClaims());
    }
}
