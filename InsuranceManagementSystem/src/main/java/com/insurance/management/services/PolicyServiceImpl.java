package com.insurance.management.services;

import com.insurance.management.dto.CreatePolicyRequestDTO;
import com.insurance.management.dto.UpdatePolicyRequestDTO;
import com.insurance.management.dto.PolicyResponseDTO;
import com.insurance.management.entity.Policy;
import com.insurance.management.exception.ResourceNotFoundException;
import com.insurance.management.repository.PolicyRepository;
import com.insurance.management.services.PolicyService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class PolicyServiceImpl implements PolicyService {

    private final PolicyRepository policyRepository;
    private final ModelMapper modelMapper;

    @Override
    public PolicyResponseDTO createPolicy(CreatePolicyRequestDTO request) {
        try {
            System.out.println("Creating Policy: " + request); // Log Request
            Policy policy = modelMapper.map(request, Policy.class);
            Policy savedPolicy = policyRepository.save(policy);
            return modelMapper.map(savedPolicy, PolicyResponseDTO.class);
        } catch (Exception e) {
            e.printStackTrace(); // PRINT THE ERROR
            throw new RuntimeException("Create Policy Failed: " + e.getMessage());
        }
    }

    @Override
    public PolicyResponseDTO updatePolicy(Long id, UpdatePolicyRequestDTO request) {
        Policy policy = policyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found with id: " + id));

        modelMapper.map(request, policy);
        Policy updatedPolicy = policyRepository.save(policy);
        return modelMapper.map(updatedPolicy, PolicyResponseDTO.class);
    }

    @Override
    public PolicyResponseDTO getPolicyById(Long id) {
        Policy policy = policyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found with id: " + id));
        return modelMapper.map(policy, PolicyResponseDTO.class);
    }

    @Override
    public List<PolicyResponseDTO> getAllPolicies() {
        return policyRepository.findAll().stream()
                .map(policy -> modelMapper.map(policy, PolicyResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public void deletePolicy(Long id) {
        if (!policyRepository.existsById(id)) {
            throw new ResourceNotFoundException("Policy not found with id: " + id);
        }
        policyRepository.deleteById(id);
    }
}
