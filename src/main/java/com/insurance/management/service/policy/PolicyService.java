package com.insurance.management.service.policy;

import com.insurance.management.dto.request.policy.CreatePolicyRequestDTO;
import com.insurance.management.dto.request.policy.UpdatePolicyRequestDTO;
import com.insurance.management.dto.response.policy.PolicyResponseDTO;

import java.util.List;

public interface PolicyService {
    PolicyResponseDTO createPolicy(CreatePolicyRequestDTO request);

    PolicyResponseDTO updatePolicy(Long id, UpdatePolicyRequestDTO request);

    PolicyResponseDTO getPolicyById(Long id);

    List<PolicyResponseDTO> getAllPolicies();

    void deletePolicy(Long id);
}
