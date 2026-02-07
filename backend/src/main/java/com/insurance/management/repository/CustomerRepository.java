package com.insurance.management.repository;

import com.insurance.management.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByEmail(String email);

    Optional<Customer> findByUserId(Long userId);

    java.util.List<Customer> findAllByDeletedFalse();

    @Modifying
    @org.springframework.transaction.annotation.Transactional
    @Query(value = "UPDATE customers SET deleted = 1 WHERE id = :id", nativeQuery = true)
    void softDeleteById(@Param("id") Long id);
}
