package com.insurance.management.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "claims")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Claim {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "customer_policy_id", nullable = false)
    private CustomerPolicy customerPolicy;

    @Column(nullable = false)
    private BigDecimal claimAmount;

    @Column(nullable = false)
    private String description;

    private LocalDate claimDate;

    @Enumerated(EnumType.STRING)
    private ClaimStatus status;

    public enum ClaimStatus {
        PENDING, APPROVED, REJECTED
    }
}
