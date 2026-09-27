package com.recruitment.portal.security;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.authentication.AuthenticationManager;

import org.springframework.security.config.Customizer;

import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.web.SecurityFilterChain;

import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;


    @Bean
    AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }


    @Bean
    SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

                .csrf(csrf -> csrf.disable())

                .cors(Customizer.withDefaults())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )


                .authorizeHttpRequests(auth -> auth


                        // ==========================================
                        // PUBLIC
                        // ==========================================

                        .requestMatchers(
                                "/api/auth/**"
                        )
                        .permitAll()


                        // ==========================================
                        // JOBS
                        // ==========================================

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/jobs/**"
                        )
                        .hasAnyRole(
                                "RECRUITER",
                                "CANDIDATE"
                        )


                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/jobs/**"
                        )
                        .hasRole("RECRUITER")


                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/jobs/**"
                        )
                        .hasRole("RECRUITER")


                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/jobs/**"
                        )
                        .hasRole("RECRUITER")


                        // ==========================================
                        // APPLICATIONS
                        // ==========================================

                        // Candidate - view own applications
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/applications/my-applications"
                        )
                        .hasRole("CANDIDATE")


                        // Recruiter - view applicants
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/applications/job/**"
                        )
                        .hasRole("RECRUITER")


                        // Candidate - apply with resume
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/applications/apply"
                        )
                        .hasRole("CANDIDATE")


                        // Candidate - upload resume
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/applications/upload-resume"
                        )
                        .hasRole("CANDIDATE")


                        // Recruiter - VIEW RESUME
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/applications/*/resume"
                        )
                        .hasRole("RECRUITER")


                        // Recruiter - update application status
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/applications/*/status"
                        )
                        .hasRole("RECRUITER")


                        // ==========================================
                        // INTERVIEWS
                        // ==========================================

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/interviews/schedule"
                        )
                        .hasRole("RECRUITER")


                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/interviews/all"
                        )
                        .hasRole("RECRUITER")


                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/interviews/dashboard"
                        )
                        .hasRole("RECRUITER")


                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/interviews/*/reschedule"
                        )
                        .hasRole("RECRUITER")


                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/interviews/*/status"
                        )
                        .hasRole("RECRUITER")


                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/interviews/*/attendance"
                        )
                        .hasRole("RECRUITER")


                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/interviews/*/result"
                        )
                        .hasRole("RECRUITER")


                        // Candidate - own interviews
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/interviews/my-interviews"
                        )
                        .hasRole("CANDIDATE")


                        // ==========================================
                        // EVERYTHING ELSE
                        // ==========================================

                        .anyRequest()
                        .authenticated()
                )


                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );


        return http.build();
    }
}