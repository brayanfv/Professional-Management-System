package com.brayanfavarin.professionalmanagement.service;

import java.util.Locale;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.brayanfavarin.professionalmanagement.dto.auth.AuthenticatedUserResponse;
import com.brayanfavarin.professionalmanagement.dto.auth.LoginRequest;
import com.brayanfavarin.professionalmanagement.dto.auth.LoginResponse;
import com.brayanfavarin.professionalmanagement.exception.InvalidCredentialsException;
import com.brayanfavarin.professionalmanagement.model.User;
import com.brayanfavarin.professionalmanagement.repository.UserRepository;
import com.brayanfavarin.professionalmanagement.security.JwtService;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public AuthService(AuthenticationManager authenticationManager, UserRepository userRepository, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        String email = normalizeEmail(request.email());
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, request.password()));
        } catch (AuthenticationException ex) {
            throw new InvalidCredentialsException();
        }

        User user = userRepository.findByEmailIgnoreCase(email).orElseThrow(InvalidCredentialsException::new);
        if (!user.isActive()) {
            throw new InvalidCredentialsException();
        }
        return new LoginResponse(jwtService.generateToken(user.getEmail(), user.getRole()), "Bearer",
                jwtService.getExpirationSeconds(), toResponse(user));
    }

    @Transactional(readOnly = true)
    public AuthenticatedUserResponse authenticatedUser(String email) {
        User user = userRepository.findByEmailIgnoreCase(normalizeEmail(email)).orElseThrow(InvalidCredentialsException::new);
        if (!user.isActive()) {
            throw new InvalidCredentialsException();
        }
        return toResponse(user);
    }

    private AuthenticatedUserResponse toResponse(User user) {
        return new AuthenticatedUserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
