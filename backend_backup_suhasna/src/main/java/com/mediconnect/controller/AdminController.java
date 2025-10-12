package com.mediconnect.controller;

import com.mediconnect.model.AdminModel;
import com.mediconnect.service.AdminService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admins")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // Get all admins
    @GetMapping
    public List<AdminModel> getAllAdmins() {
        return adminService.getAllAdmins();
    }

    // Get admin by ID
    @GetMapping("/{id}")
    public AdminModel getAdminById(@PathVariable String id) {
        return adminService.getAdminById(id);
    }

    // Create new admin
    @PostMapping("/create")
    public AdminModel createAdmin(@RequestBody AdminModel admin) {
        return adminService.saveAdmin(admin);
    }

    // Delete admin
    @DeleteMapping("/{id}")
    public String deleteAdmin(@PathVariable String id) {
        adminService.deleteAdmin(id);
        return "Admin deleted successfully!";
    }
}
