package com.insurance.management.services;

import com.insurance.management.dto.CreateClaimRequestDTO;
import com.insurance.management.dto.ClaimResponseDTO;
import com.insurance.management.entity.Claim;
import com.insurance.management.entity.CustomerPolicy;
import com.insurance.management.exception.ResourceNotFoundException;
import com.insurance.management.repository.ClaimRepository;
import com.insurance.management.repository.CustomerPolicyRepository;
import com.insurance.management.services.ClaimService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ClaimServiceImpl implements ClaimService {

    private final ClaimRepository claimRepository;
    private final CustomerPolicyRepository customerPolicyRepository;
    private final ModelMapper modelMapper;

    @Override
    public ClaimResponseDTO createClaim(CreateClaimRequestDTO request) {
        CustomerPolicy enrollment = customerPolicyRepository.findById(request.getCustomerPolicyId())
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found"));

        Claim claim = modelMapper.map(request, Claim.class);
        claim.setCustomerPolicy(enrollment);
        claim.setClaimDate(LocalDate.now());
        claim.setStatus(Claim.ClaimStatus.PENDING);

        Claim savedClaim = claimRepository.save(claim);
        return modelMapper.map(savedClaim, ClaimResponseDTO.class);
    }

    @Override
    public ClaimResponseDTO updateClaimStatus(Long claimId, String status) {
        try {
            Claim claim = claimRepository.findById(claimId)
                    .orElseThrow(() -> new ResourceNotFoundException("Claim not found"));

            try {
                claim.setStatus(Claim.ClaimStatus.valueOf(status.toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new ResourceNotFoundException("Invalid status value: " + status);
            }

            Claim updatedClaim = claimRepository.saveAndFlush(claim);

            // Manual Mapping to avoid ModelMapper issues/recursion
            ClaimResponseDTO response = new ClaimResponseDTO();
            response.setId(updatedClaim.getId());
            response.setClaimAmount(updatedClaim.getClaimAmount());
            response.setClaimDate(updatedClaim.getClaimDate());
            response.setDescription(updatedClaim.getDescription());
            response.setStatus(updatedClaim.getStatus().name());

            if (updatedClaim.getCustomerPolicy() != null) {
                response.setCustomerPolicyId(updatedClaim.getCustomerPolicy().getId());
            } else {
                response.setCustomerPolicyId(0L);
            }

            return response;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Service Error: " + e.getClass().getSimpleName() + " - " + e.getMessage());
        }
    }

    @Override
    public List<ClaimResponseDTO> getClaimsByEnrollment(Long enrollmentId) {
        return claimRepository.findByCustomerPolicy_Id(enrollmentId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ClaimResponseDTO> getAllClaims() {
        return claimRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private ClaimResponseDTO mapToDTO(Claim claim) {
        ClaimResponseDTO dto = new ClaimResponseDTO();
        dto.setId(claim.getId());
        dto.setClaimAmount(claim.getClaimAmount());
        dto.setClaimDate(claim.getClaimDate());
        dto.setDescription(claim.getDescription());
        dto.setStatus(claim.getStatus().name());
        if (claim.getCustomerPolicy() != null) {
            dto.setCustomerPolicyId(claim.getCustomerPolicy().getId());
        }
        return dto;
    }
}
