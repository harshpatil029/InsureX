package com.insurance.management.repository;

import com.insurance.management.entity.Claim;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ClaimRepository extends JpaRepository<Claim, Long> {
    List<Claim> findByCustomerPolicy_Id(Long customerPolicyId);
}
