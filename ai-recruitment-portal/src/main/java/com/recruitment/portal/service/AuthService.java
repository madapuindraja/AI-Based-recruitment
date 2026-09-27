package com.recruitment.portal.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.recruitment.portal.dto.AuthResponse;
import com.recruitment.portal.dto.LoginRequest;
import com.recruitment.portal.dto.RegisterRequest;
import com.recruitment.portal.entity.User;
import com.recruitment.portal.repository.UserRepository;
import com.recruitment.portal.security.JwtService;

@Service
public class AuthService {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    // =====================================================
    // REGISTER USER
    // =====================================================

    public String register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return "Email already registered";
        }

        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );
        user.setPhone(request.getPhone());
        user.setRole(request.getRole());

        userRepository.save(user);

        return "User Registered Successfully";
    }


    // =====================================================
    // LOGIN USER
    // =====================================================

    public AuthResponse login(LoginRequest request) {

        // Find user by email
        User user = userRepository
                .findByEmail(request.getEmail())
                .orElse(null);


        // User not found
        if (user == null) {

            return new AuthResponse(
                    null,
                    null,
                    "User not found"
            );
        }


        // Check password
        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            return new AuthResponse(
                    null,
                    null,
                    "Invalid Password"
            );
        }


        // Generate JWT token
        String token = jwtService.generateToken(
                user.getEmail()
        );


        // Get user role
        String role = user.getRole().name();


        // Return token + role
        return new AuthResponse(
                token,
                role,
                "Login Successful"
        );
    }
}