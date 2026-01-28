package com.insurance.management.repository;

import com.insurance.management.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByClaimId(Long claimId);

    List<Document> findByCustomerId(Long customerId);
}
