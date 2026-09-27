package com.recruitment.portal.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "candidates")
public class Candidate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "candidate_id")
    private Long id;

    @Column(name = "full_name")
    private String fullName;

    private String email;

    private String phone;

    private String skills;

    private int experience;

    private String education;

    @Column(name = "resume_url")
    private String resumeUrl;

    private String address;

    private String linkedin;

    private String github;

    @Column(name = "user_id")
    private Long userId;

    // Getters and Setters
}