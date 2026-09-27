package com.recruitment.portal.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.recruitment.portal.dto.RegisterRequest;
import com.recruitment.portal.entity.User;
import com.recruitment.portal.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    // =========================================================
    // REGISTER USER
    // =========================================================

    public String registerUser(
            RegisterRequest request) {

        // Check if email already exists
        if (userRepository
                .findByEmail(request.getEmail())
                .isPresent()) {

            return "Email already registered";
        }


        User user = new User();

        user.setFullName(
                request.getFullName()
        );

        user.setEmail(
                request.getEmail()
        );


        // Encrypt password
        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );


        user.setPhone(
                request.getPhone()
        );

        user.setRole(
                request.getRole()
        );


        userRepository.save(user);

        return "User Registered Successfully";
    }


    // =========================================================
    // GET USER BY EMAIL
    // =========================================================

    public User getUserByEmail(
            String email) {

        Optional<User> user =
                userRepository.findByEmail(email);

        if (user.isEmpty()) {

            throw new RuntimeException(
                    "User not found"
            );
        }

        return user.get();
    }
}