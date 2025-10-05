package com.mediconnect.service;

import com.mediconnect.model.UserModel;
import com.mediconnect.repository.UserRepository;
import com.mediconnect.service.UserServiceImpl; 

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @InjectMocks private UserServiceImpl userService;

    @Test
    void findByEmail_success() {
        UserModel u = new UserModel();
        u.setEmail("john@example.com");
        Mockito.when(userRepository.findByEmail("john@example.com"))
               .thenReturn(Optional.of(u));

        UserModel out = userService.findByEmail("john@example.com");

        Assertions.assertNotNull(out);
        Assertions.assertEquals("john@example.com", out.getEmail());
    }

    @Test
    void findByEmail_notFound() {
        Mockito.when(userRepository.findByEmail("nope@example.com"))
               .thenReturn(Optional.empty());

        UserModel result = userService.findByEmail("nope@example.com");
        Assertions.assertNull(result); // Implementation returns null, not exception
    }

    @Test
    void saveUser_encodesPassword() {
        UserModel user = new UserModel();
        user.setEmail("test@example.com");
        user.setPassword("plaintext");
        
        Mockito.when(passwordEncoder.encode("plaintext")).thenReturn("$2a$10$encoded");
        Mockito.when(userRepository.save(user)).thenReturn(user);
        
        UserModel result = userService.saveUser(user);
        
        Assertions.assertNotNull(result);
        Assertions.assertEquals("$2a$10$encoded", result.getPassword());
        Mockito.verify(passwordEncoder).encode("plaintext");
    }
}