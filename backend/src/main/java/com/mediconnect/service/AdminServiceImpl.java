package com.mediconnect.service;

import com.mediconnect.model.AdminModel;
import com.mediconnect.repository.AdminRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminServiceImpl implements AdminService {

    private final AdminRepository adminRepository;

    public AdminServiceImpl(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @Override
    public AdminModel saveAdmin(AdminModel admin) {
        return adminRepository.save(admin);
    }

    @Override
    public List<AdminModel> getAllAdmins() {
        return adminRepository.findAll();
    }

    @Override
    public AdminModel getAdminById(String id) {
        Optional<AdminModel> admin = adminRepository.findById(id);
        return admin.orElse(null);
    }

    @Override
    public void deleteAdmin(String id) {
        adminRepository.deleteById(id);
    }
}
