package com.mediconnect.service;

import com.mediconnect.model.UserModel;
import com.mediconnect.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserModel saveUser(UserModel user) {
        // Hash password if it's not already hashed (simple check)
        if (user.getPassword() != null && !user.getPassword().startsWith("$2a$")) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        return userRepository.save(user);
    }

    @Override
    public List<UserModel> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public UserModel getUserById(String id) {
        Optional<UserModel> user = userRepository.findById(id);
        return user.orElse(null);
    }

    @Override
    public UserModel findByEmail(String email) {
        Optional<UserModel> user = userRepository.findByEmail(email);
        return user.orElse(null);
    }

    @Override
    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }
}