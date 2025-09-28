package com.mediconnect.service;

import com.mediconnect.model.UserModel;
import java.util.List;

public interface UserService {
    UserModel saveUser(UserModel user);
    List<UserModel> getAllUsers();
    UserModel getUserById(String id);
    UserModel findByEmail(String email);
    void deleteUser(String id);
}
