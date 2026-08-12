package com.brayanfavarin.professionalmanagement.security;

import java.util.Locale;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.brayanfavarin.professionalmanagement.enums.UserRole;
import com.brayanfavarin.professionalmanagement.model.User;
import com.brayanfavarin.professionalmanagement.repository.UserRepository;

@Configuration
@Profile("!test")
public class AdminBootstrap {

    @Bean
    ApplicationRunner createInitialAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder,
            @Value("${app.bootstrap.admin.name:}") String name,
            @Value("${app.bootstrap.admin.email:}") String email,
            @Value("${app.bootstrap.admin.password:}") String password) {
        return arguments -> {
            if (name.isBlank() || email.isBlank() || password.isBlank()) {
                return;
            }
            String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);
            if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
                return;
            }
            User user = new User();
            user.setName(name.trim());
            user.setEmail(normalizedEmail);
            user.setPassword(passwordEncoder.encode(password));
            user.setRole(UserRole.ADMIN);
            user.setActive(true);
            userRepository.save(user);
        };
    }
}
