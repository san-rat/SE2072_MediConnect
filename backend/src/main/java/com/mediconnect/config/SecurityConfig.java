package com.mediconnect.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

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
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))    // use our CorsConfigurationSource bean
            .csrf(csrf -> csrf.disable())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/",                      // health/home
                    "/api/auth/**",           // login + register
                    "/api/doctors/**",        // get all doctors (public)
                    "/api/appointments/available-slots/**",  // get available time slots (public)
                    "/api/appointments/test/**",  // test endpoints for initialization
                    "/api/test/**",           // test data endpoints for debugging
                    "/api/debug/**"           // debug endpoints
                ).permitAll()

                    .requestMatchers("/files/**").permitAll()
                    .requestMatchers("/api/prescriptions/doctor/**").hasRole("DOCTOR")
                    .requestMatchers("/api/prescriptions/patient/**").hasRole("PATIENT")
                    .requestMatchers("/api/medical-records/doctor/**").hasRole("DOCTOR")
                    .requestMatchers("/api/medical-records/patient/**").hasRole("PATIENT")
                    // ---- Health Tips ----
                    .requestMatchers("/api/health-tips/personalized").permitAll()  // patient
                    .requestMatchers("/api/health-tips/**").hasRole("ADMIN")        // admin CRUD
                    .requestMatchers("/api/admins/**").hasRole("ADMIN")  // Admin-only endpoints
                .anyRequest().authenticated()
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of(
                "http://localhost:5173",
                "http://localhost:3000",
                "https://mediconnect-iota.vercel.app",
                "https://*.vercel.app"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}