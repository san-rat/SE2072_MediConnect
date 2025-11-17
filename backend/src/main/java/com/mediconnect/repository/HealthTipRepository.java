package com.mediconnect.repository;

import com.mediconnect.model.HealthTip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HealthTipRepository extends JpaRepository<HealthTip, Long> {

    @Query("SELECT t FROM HealthTip t WHERE " +
            "(:condition = t.condition OR t.condition = 'General') AND " +
            "(:age BETWEEN t.ageMin AND t.ageMax) AND " +
            "(:gender = t.gender OR t.gender = 'All')")
    List<HealthTip> findMatchingTips(
            @Param("age") int age,
            @Param("gender") String gender,
            @Param("condition") String condition);
}

