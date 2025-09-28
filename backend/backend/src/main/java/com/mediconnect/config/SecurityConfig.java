package com.mediconnect.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import com.mediconnect.config.JwtAuthenticationFilter;

@Configuration
public class SecurityConfig {

    // AuthenticationManager for AuthController
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // DaoAuthenticationProvider for database authentication
    @Bean
    public DaoAuthenticationProvider authenticationProvider(UserDetailsService userDetailsService, PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

    // Security rules + enable CORS + disable CSRF for APIs
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, DaoAuthenticationProvider provider, JwtAuthenticationFilter jwtAuthFilter) throws Exception {
        http
            .cors(Customizer.withDefaults())    // use our CorsConfigurationSource bean
            .csrf(csrf -> csrf.disable())
            .authenticationProvider(provider)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/",                      // health/home
                    "/api/auth/**",           // login + register
                    "/api/doctors/**",        // get all doctors (public)
                    "/api/appointments/available-slots/**",  // get available time slots (public)
                    "/api/appointments/test/**"  // test endpoints for initialization
                ).permitAll()
                .anyRequest().authenticated()
            );

        return http.build();
    }
}