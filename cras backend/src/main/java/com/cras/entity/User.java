package com.cras.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role;

    private String location;

    public User() {
    }

    public User(String name, String email, String password,
                String role, String location) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.location = location;
    }




}