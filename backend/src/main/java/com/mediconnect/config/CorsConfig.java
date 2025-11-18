package com.mediconnect.config;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.lang.NonNull;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    /**
     * Allowed origins are now driven from application.properties:
     * app.cors.allowed-origins=https://your-frontend-domain.com,http://localhost:5173
     */
    @Value("#{'${app.cors.allowed-origins}'.split(',')}")
    private List<String> allowedOrigins;

    /**
     * Max age (in seconds) for CORS preflight cache, from application.properties:
     * app.cors.max-age=3600
     */
    @Value("${app.cors.max-age:3600}")
    private long corsMaxAge;

    private static final List<String> ALLOWED_ORIGIN_PATTERNS = List.of(
            "http://localhost:*",
            "https://mediconnect-*.vercel.app"
    );

    private static final List<String> ALLOWED_METHODS = List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS");
    private static final List<String> ALLOWED_HEADERS = List.of(
            "Authorization",
            "Content-Type",
            "X-Requested-With",
            "Accept",
            "Origin",
            "Cache-Control",
            "Pragma"
    );
    private static final List<String> EXPOSED_HEADERS = List.of("Authorization", "Set-Cookie");

    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(allowedOrigins.toArray(new String[0]))
                .allowedOriginPatterns(ALLOWED_ORIGIN_PATTERNS.toArray(new String[0]))
                .allowedMethods(ALLOWED_METHODS.toArray(new String[0]))
                .allowedHeaders(ALLOWED_HEADERS.toArray(new String[0]))
                .exposedHeaders(EXPOSED_HEADERS.toArray(new String[0]))
                .allowCredentials(true)
                .maxAge(corsMaxAge);
    }

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        Path base = Paths.get("uploads").toAbsolutePath().normalize();
        registry.addResourceHandler("/files/**")
                .addResourceLocations(base.toUri().toString() + "/")
                .setCachePeriod(3600);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", buildCorsConfiguration());
        return source;
    }

    @Bean
    public FilterRegistrationBean<CorsFilter> corsFilter(CorsConfigurationSource corsConfigurationSource) {
        FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<>(new CorsFilter(corsConfigurationSource));
        bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return bean;
    }

    private CorsConfiguration buildCorsConfiguration() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(allowedOrigins);
        config.setAllowedOriginPatterns(ALLOWED_ORIGIN_PATTERNS);
        config.setAllowedMethods(ALLOWED_METHODS);
        config.setAllowedHeaders(ALLOWED_HEADERS);
        config.setExposedHeaders(EXPOSED_HEADERS);
        config.setAllowCredentials(true);
        config.setMaxAge(corsMaxAge);
        return config;
    }
}

