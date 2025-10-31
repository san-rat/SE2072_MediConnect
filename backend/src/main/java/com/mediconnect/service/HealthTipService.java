package com.mediconnect.service;

import com.mediconnect.model.HealthTip;
import com.mediconnect.repository.HealthTipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class HealthTipService {
    @Autowired
    private HealthTipRepository healthTipRepository;

    public List<HealthTip> getPersonalizedTips(int age, String gender, String condition) {
        return healthTipRepository.findMatchingTips(age, gender, condition);
    }

    // Admin
    public Page<HealthTip> list(Pageable pageable) {
        return healthTipRepository.findAll(pageable);
    }

    public HealthTip create(HealthTip tip) {
        tip.setTipId(null);
        return healthTipRepository.save(tip);
    }

    public HealthTip update(Long id, HealthTip tip) {
        HealthTip existing = healthTipRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("HealthTip not found: " + id));
        existing.setCondition(tip.getCondition());
        existing.setAgeMin(tip.getAgeMin());
        existing.setAgeMax(tip.getAgeMax());
        existing.setGender(tip.getGender());
        existing.setMessage(tip.getMessage());
        return healthTipRepository.save(existing);
    }

    public void delete(Long id) {
        healthTipRepository.deleteById(id);
    }
}
