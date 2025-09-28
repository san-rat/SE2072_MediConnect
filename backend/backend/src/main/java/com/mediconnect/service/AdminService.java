package com.mediconnect.service;

import com.mediconnect.model.AdminModel;
import java.util.List;

public interface AdminService {
    AdminModel saveAdmin(AdminModel admin);
    List<AdminModel> getAllAdmins();
    AdminModel getAdminById(String id);
    void deleteAdmin(String id);
}
