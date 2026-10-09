package com.cras.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "resource_requests")
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String requesterName;

    @Column(nullable = false)
    private Long resourceId;

    @Column(nullable = false)
    private Integer quantity;

    // User enters these values on a 1-10 scale.
    private Integer peopleAffected;
    private Integer peopleInDanger;
    private Integer criticalPeople;
    private Integer hoursWithoutResource;

    private Double severity;      // calculated by backend
    private Double scarcity;      // calculated/assigned by backend
    private Double priorityScore; // calculated by backend



    private String status;
    private LocalDateTime createdAt;

    public Request() {}

    @PrePersist
    public void beforeInsert() {
        createdAt = LocalDateTime.now();
        if (status == null) status = "PENDING";
    }


}
