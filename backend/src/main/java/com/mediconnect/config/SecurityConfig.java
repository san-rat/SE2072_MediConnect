package com.mediconnect.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    // AuthenticationManager for AuthController
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // Security rules + enable CORS + disable CSRF for APIs
    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http,
            JwtAuthenticationFilter jwtAuthFilter   // <-- your custom JWT filter bean
    ) throws Exception {
        http
            .cors(Customizer.withDefaults())    // use our CorsConfigurationSource bean
            .csrf(csrf -> csrf.disable())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/",                              // health/home
                    "/api/auth/**",                   // login + register
                    "/api/doctors/**",                // doctors (public GETs)
                    "/api/appointments/available-slots/**",
                    "/api/appointments/test/**"
                ).permitAll()
                .anyRequest().authenticated()
            );

        return http.build();
    }
}