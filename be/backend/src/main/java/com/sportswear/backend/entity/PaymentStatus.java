package com.sportswear.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "payment_statuses")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class PaymentStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String name;

    private String description;
}
