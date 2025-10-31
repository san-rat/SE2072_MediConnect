package com.mediconnect.config;

import com.mediconnect.model.HealthTip;
import com.mediconnect.repository.HealthTipRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class HealthTipSeedConfig {

    @Bean
    CommandLineRunner seedHealthTips(HealthTipRepository repo) {
        return args -> {
            if (repo.count() > 0) return;

            repo.save(new HealthTip("General", 18, 120, "All",
                    "Stay hydrated, aim for 7–9 hours of sleep, and walk 30 minutes daily."));
            repo.save(new HealthTip("Diabetes", 18, 80, "All",
                    "Monitor blood sugar regularly and prioritize a low-glycemic, high-fiber diet."));
            repo.save(new HealthTip("Heart", 30, 80, "Male",
                    "Target 150 minutes of moderate cardio weekly; cut saturated fats and sodium."));
            repo.save(new HealthTip("Heart", 30, 80, "Female",
                    "Add routine cardio and schedule annual BP & lipid profile checks."));
            repo.save(new HealthTip("Asthma", 10, 80, "All",
                    "Carry your reliever inhaler and avoid known triggers; warm up before exercise."));
            repo.save(new HealthTip("None", 12, 120, "All",
                    "Keep vaccines current and do an annual wellness check."));
        };
    }
}
