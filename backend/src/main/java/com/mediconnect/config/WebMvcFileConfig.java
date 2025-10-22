package com.mediconnect.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebMvcFileConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path base = Paths.get("uploads").toAbsolutePath().normalize();
        registry.addResourceHandler("/files/**")
                .addResourceLocations(base.toUri().toString() + "/")
                .setCachePeriod(3600);
    }
}
