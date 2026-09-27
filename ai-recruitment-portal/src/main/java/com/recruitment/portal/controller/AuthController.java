package com.recruitment.portal.controller;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.recruitment.portal.dto.AuthResponse;
import com.recruitment.portal.dto.LoginRequest;
import com.recruitment.portal.dto.RegisterRequest;
import com.recruitment.portal.entity.User;
import com.recruitment.portal.service.AuthService;
import com.recruitment.portal.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserService userService;


    // =========================================================
    // REGISTER
    // =========================================================

    @PostMapping("/register")
    public String register(
            @RequestBody RegisterRequest request) {

        return authService.register(request);
    }


    // =========================================================
    // LOGIN
    // =========================================================

    @PostMapping("/login")
    public AuthResponse login(
            @RequestBody LoginRequest request) {

        return authService.login(request);
    }


    // =========================================================
    // GET LOGGED-IN USER PROFILE
    // =========================================================

    @GetMapping("/profile")
    public User getProfile(
            Principal principal) {

        String email = principal.getName();

        return userService.getUserByEmail(email);
    }
}