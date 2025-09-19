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

@Configuration
public class SecurityConfig {

    // Using CustomUserDetailsService instead of creating a new bean

    // Use your userDetailsService + password encoder
    @Bean
    public DaoAuthenticationProvider authProvider(UserDetailsService uds, PasswordEncoder encoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(uds);
        provider.setPasswordEncoder(encoder);
        return provider;
    }

    // AuthenticationManager for AuthController (you already inject it there)
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // Security rules + enable CORS + disable CSRF for APIs
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, DaoAuthenticationProvider provider) throws Exception {
        http
            .cors(Customizer.withDefaults())    // use our CorsConfigurationSource bean
            .csrf(csrf -> csrf.disable())
            .authenticationProvider(provider)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/",                      // health/home
                    "/api/auth/**",           // login + register
                    "/api/doctors"            // get all doctors (public)
                ).permitAll()
                .anyRequest().authenticated()
            );

        return http.build();
    }
}