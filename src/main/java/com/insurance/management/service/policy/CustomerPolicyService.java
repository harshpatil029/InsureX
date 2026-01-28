package com.insurance.management.service.policy;

import com.insurance.management.entity.CustomerPolicy;
import java.util.List;

public interface CustomerPolicyService {
    CustomerPolicy enrollCustomer(Long customerId, Long policyId);

    List<CustomerPolicy> getPoliciesByCustomer(Long customerId);

    CustomerPolicy updateStatus(Long enrollmentId, CustomerPolicy.PolicyStatus status);
}
