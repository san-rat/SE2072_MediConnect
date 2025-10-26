package com.mediconnect.repository;

import com.mediconnect.model.DoctorModel;
import com.mediconnect.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<DoctorModel, String> {
    Optional<DoctorModel> findByUserId(String userId);
    Optional<DoctorModel> findByLicenseNumber(String licenseNumber);
    List<DoctorModel> findBySpecialization(String specialization);
    Optional<DoctorModel> findByUser(UserModel user);
    Optional<DoctorModel> findByUserEmail(String email);
    Optional<DoctorModel> findByUser_Id(String id);

}

