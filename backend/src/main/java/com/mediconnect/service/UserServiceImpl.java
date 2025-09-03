package com.mediconnect.service;

import com.mediconnect.model.UserModel;
import com.mediconnect.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserModel saveUser(UserModel user) {
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
    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }
}
