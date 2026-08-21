package com.brayanfavarin.professionalmanagement;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.brayanfavarin.professionalmanagement.dto.auth.AuthenticatedUserResponse;
import com.brayanfavarin.professionalmanagement.dto.auth.LoginRequest;
import com.brayanfavarin.professionalmanagement.dto.auth.LoginResponse;
import com.brayanfavarin.professionalmanagement.enums.UserRole;
import com.brayanfavarin.professionalmanagement.security.AuthenticatedSession;

class AuthenticationLoggingSafetyTests {

    @Test
    void redactsPasswordFromLoginRequestStringRepresentation() {
        String password = "clear-text-password-for-test";

        String representation = new LoginRequest("admin@example.com", password).toString();

        assertThat(representation)
                .contains("admin@example.com", "password=[REDACTED]")
                .doesNotContain(password);
    }

    @Test
    void keepsJwtOutOfTheApiLoginResponseAndRedactsTheInternalSessionRepresentation() {
        String accessToken = "header.payload.signature-for-test";
        AuthenticatedUserResponse user = new AuthenticatedUserResponse(
                1L, "Administrator", "admin@example.com", UserRole.ADMIN);

        String responseRepresentation = new LoginResponse(user).toString();
        String sessionRepresentation = new AuthenticatedSession(accessToken, user).toString();

        assertThat(responseRepresentation)
                .contains("admin@example.com")
                .doesNotContain(accessToken, "accessToken");
        assertThat(sessionRepresentation)
                .contains("token=[REDACTED]", "admin@example.com")
                .doesNotContain(accessToken);
    }
}
