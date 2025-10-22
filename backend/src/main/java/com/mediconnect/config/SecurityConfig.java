package com.mediconnect.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.web.firewall.HttpFirewall;
import org.springframework.security.web.firewall.StrictHttpFirewall;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    // AuthenticationManager for AuthController
    @Bean
    public AuthenticationManager authenticationManager(UserDetailsService userDetailsService, PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(passwordEncoder);
        authProvider.setUserDetailsService(userDetailsService);
        return new ProviderManager(authProvider);
    }

    // Security rules + enable CORS + disable CSRF for APIs
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthFilter) throws Exception {
        http
            .cors(Customizer.withDefaults())    // use our CorsConfigurationSource bean
            .csrf(csrf -> csrf.disable())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/",                      // health/home
                    "/api/auth/**",           // login + register
                    "/api/doctors/**",        // get all doctors (public)
                    "/api/appointments/available-slots/**",  // get available time slots (public)
                    "/api/appointments/test/**",  // test endpoints for initialization
                    "/api/debug/**"           // debug endpoints
                ).permitAll()

                    .requestMatchers("/files/**").permitAll()
                    .requestMatchers("/api/prescriptions/doctor/**").hasRole("DOCTOR")
                    .requestMatchers("/api/prescriptions/patient/**").hasRole("PATIENT")
                    .requestMatchers("/api/medical-records/doctor/**").hasRole("DOCTOR")
                    .requestMatchers("/api/medical-records/patient/**").hasRole("PATIENT")
                    .requestMatchers("/api/admins/**").hasRole("ADMIN")  // Admin-only endpoints
                .anyRequest().authenticated()
            );

        return http.build();
    }
}