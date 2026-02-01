package com.insurance.management.repository;

import com.insurance.management.entity.CustomerPolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CustomerPolicyRepository extends JpaRepository<CustomerPolicy, Long> {
    List<CustomerPolicy> findByCustomer_Id(Long customerId);
}
