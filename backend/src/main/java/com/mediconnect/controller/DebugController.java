package com.mediconnect.controller;

import com.mediconnect.model.UserModel;
import com.mediconnect.model.AdminModel;
import com.mediconnect.service.UserService;
import com.mediconnect.service.AdminService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/debug")
public class DebugController {

    private final UserService userService;
    private final AdminService adminService;
    private final PasswordEncoder passwordEncoder;

    public DebugController(UserService userService, AdminService adminService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.adminService = adminService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/user/{email}")
    public Map<String, Object> debugUser(@PathVariable String email) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // 1. Check if user exists
            UserModel user = userService.findByEmail(email);
            if (user == null) {
                result.put("error", "User not found");
                return result;
            }
            
            result.put("user_found", true);
            result.put("user_id", user.getId());
            result.put("user_email", user.getEmail());
            result.put("user_active", user.getIsActive());
            result.put("password_hash", user.getPassword());
            result.put("password_length", user.getPassword().length());
            
            // 2. Check if user is admin
            AdminModel admin = adminService.findByUserId(user.getId());
            if (admin != null) {
                result.put("is_admin", true);
                result.put("admin_role", admin.getRoleLevel());
            } else {
                result.put("is_admin", false);
            }
            
            // 3. Test password encoding
            String testPassword = "Admin123!";
            boolean passwordMatches = passwordEncoder.matches(testPassword, user.getPassword());
            result.put("password_test", passwordMatches);
            result.put("test_password", testPassword);
            
        } catch (Exception e) {
            result.put("error", e.getMessage());
            result.put("exception", e.getClass().getSimpleName());
        }
        
        return result;
    }
    
    @PostMapping("/test-login")
    public Map<String, Object> testLogin(@RequestBody Map<String, String> request) {
        Map<String, Object> result = new HashMap<>();
        
        String email = request.get("email");
        String password = request.get("password");
        
        try {
            // 1. Find user
            UserModel user = userService.findByEmail(email);
            if (user == null) {
                result.put("error", "User not found");
                return result;
            }
            
            result.put("user_found", true);
            result.put("user_id", user.getId());
            
            // 2. Test password
            boolean passwordMatches = passwordEncoder.matches(password, user.getPassword());
            result.put("password_matches", passwordMatches);
            
            if (passwordMatches) {
                // 3. Check admin status
                AdminModel admin = adminService.findByUserId(user.getId());
                if (admin != null) {
                    result.put("is_admin", true);
                    result.put("admin_role", admin.getRoleLevel());
                } else {
                    result.put("is_admin", false);
                }
            }
            
        } catch (Exception e) {
            result.put("error", e.getMessage());
        }
        
        return result;
    }
    
    @PostMapping("/generate-hash")
    public Map<String, Object> generateHash(@RequestBody Map<String, String> request) {
        Map<String, Object> result = new HashMap<>();
        String password = request.get("password");
        String hash = passwordEncoder.encode(password);
        result.put("password", password);
        result.put("hash", hash);
        result.put("length", hash.length());
        return result;
    }
}
