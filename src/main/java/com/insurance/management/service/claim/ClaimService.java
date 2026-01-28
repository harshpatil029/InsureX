package com.insurance.management.service.claim;

import com.insurance.management.dto.request.claim.CreateClaimRequestDTO;
import com.insurance.management.dto.response.claim.ClaimResponseDTO;
import java.util.List;

public interface ClaimService {
    ClaimResponseDTO createClaim(CreateClaimRequestDTO request);

    ClaimResponseDTO updateClaimStatus(Long claimId, String status);

    List<ClaimResponseDTO> getClaimsByEnrollment(Long enrollmentId);

    List<ClaimResponseDTO> getAllClaims();
}
