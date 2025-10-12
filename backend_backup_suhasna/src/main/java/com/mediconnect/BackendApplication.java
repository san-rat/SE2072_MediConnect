package com.mediconnect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class BackendApplication {
    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(BackendApplication.class);
        ConfigurableApplicationContext context = app.run(args);
        System.out.println("JWT Secret = " + context.getEnvironment().getProperty("app.jwt.secret"));
    }
}
