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
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found"));
        claim.setStatus(Claim.ClaimStatus.valueOf(status));
        Claim updatedClaim = claimRepository.save(claim);
        return modelMapper.map(updatedClaim, ClaimResponseDTO.class);
    }

    @Override
    public List<ClaimResponseDTO> getClaimsByEnrollment(Long enrollmentId) {
        return claimRepository.findByCustomerPolicyId(enrollmentId).stream()
                .map(claim -> modelMapper.map(claim, ClaimResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<ClaimResponseDTO> getAllClaims() {
        return claimRepository.findAll().stream()
                .map(claim -> modelMapper.map(claim, ClaimResponseDTO.class))
                .collect(Collectors.toList());
    }
}
