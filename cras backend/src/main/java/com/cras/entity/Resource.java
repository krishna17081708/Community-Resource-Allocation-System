package com.cras.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Entity
@Table(name = "resources")
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String unit;

    @Column(nullable = false)
    private Integer availableQuantity;

    public Resource() {}

    public Resource(String name, String unit, Integer availableQuantity) {
        this.name = name;
        this.unit = unit;
        this.availableQuantity = availableQuantity;
    }



}
