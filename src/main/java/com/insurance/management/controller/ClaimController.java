package com.insurance.management.controller;

import com.insurance.management.dto.request.claim.CreateClaimRequestDTO;
import com.insurance.management.dto.response.claim.ClaimResponseDTO;
import com.insurance.management.service.claim.ClaimService;
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
    public ResponseEntity<ClaimResponseDTO> createClaim(@Valid @RequestBody CreateClaimRequestDTO request) {
        return ResponseEntity.ok(claimService.createClaim(request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ClaimResponseDTO> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(claimService.updateClaimStatus(id, status));
    }

    @GetMapping("/enrollment/{enrollmentId}")
    public ResponseEntity<List<ClaimResponseDTO>> getByEnrollment(@PathVariable Long enrollmentId) {
        return ResponseEntity.ok(claimService.getClaimsByEnrollment(enrollmentId));
    }

    @GetMapping
    public ResponseEntity<List<ClaimResponseDTO>> getAllClaims() {
        return ResponseEntity.ok(claimService.getAllClaims());
    }
}
