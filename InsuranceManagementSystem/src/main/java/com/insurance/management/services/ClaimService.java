package com.insurance.management.services;

import com.insurance.management.dto.CreateClaimRequestDTO;
import com.insurance.management.dto.ClaimResponseDTO;
import java.util.List;

public interface ClaimService {
    ClaimResponseDTO createClaim(CreateClaimRequestDTO request);

    ClaimResponseDTO updateClaimStatus(Long claimId, String status);

    List<ClaimResponseDTO> getClaimsByEnrollment(Long enrollmentId);

    List<ClaimResponseDTO> getAllClaims();
}
