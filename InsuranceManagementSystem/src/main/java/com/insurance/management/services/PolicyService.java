package com.insurance.management.services;

import com.insurance.management.dto.CreatePolicyRequestDTO;
import com.insurance.management.dto.UpdatePolicyRequestDTO;
import com.insurance.management.dto.PolicyResponseDTO;

import java.util.List;

public interface PolicyService {
    PolicyResponseDTO createPolicy(CreatePolicyRequestDTO request);

    PolicyResponseDTO updatePolicy(Long id, UpdatePolicyRequestDTO request);

    PolicyResponseDTO getPolicyById(Long id);

    List<PolicyResponseDTO> getAllPolicies();

    void deletePolicy(Long id);
}
