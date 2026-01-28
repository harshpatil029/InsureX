package com.insurance.management.service.policy.impl;

import com.insurance.management.entity.Customer;
import com.insurance.management.entity.CustomerPolicy;
import com.insurance.management.entity.Policy;
import com.insurance.management.exception.ResourceNotFoundException;
import com.insurance.management.repository.CustomerPolicyRepository;
import com.insurance.management.repository.CustomerRepository;
import com.insurance.management.repository.PolicyRepository;
import com.insurance.management.service.policy.CustomerPolicyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CustomerPolicyServiceImpl implements CustomerPolicyService {

    private final CustomerPolicyRepository customerPolicyRepository;
    private final CustomerRepository customerRepository;
    private final PolicyRepository policyRepository;

    @Override
    public CustomerPolicy enrollCustomer(Long customerId, Long policyId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        Policy policy = policyRepository.findById(policyId)
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found"));

        CustomerPolicy enrollment = CustomerPolicy.builder()
                .customer(customer)
                .policy(policy)
                .startDate(LocalDate.now())
                .endDate(LocalDate.now().plusMonths(policy.getDurationInMonths()))
                .status(CustomerPolicy.PolicyStatus.ACTIVE)
                .build();

        return customerPolicyRepository.save(enrollment);
    }

    @Override
    public List<CustomerPolicy> getPoliciesByCustomer(Long customerId) {
        return customerPolicyRepository.findByCustomerId(customerId);
    }

    @Override
    public CustomerPolicy updateStatus(Long enrollmentId, CustomerPolicy.PolicyStatus status) {
        CustomerPolicy enrollment = customerPolicyRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found"));
        enrollment.setStatus(status);
        return customerPolicyRepository.save(enrollment);
    }
}
