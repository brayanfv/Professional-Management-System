package com.brayanfavarin.professionalmanagement.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Credentials for an active administrative user")
public record LoginRequest(
        @NotBlank(message = "Email is required") @Email(message = "Email must be valid") @Size(max = 180)
        @Schema(example = "admin@example.com") String email,
        @NotBlank(message = "Password is required") @Size(max = 255)
        @Schema(example = "password", description = "Example only; never use a production password") String password) {

    @Override
    public String toString() {
        return "LoginRequest[email=" + email + ", password=[REDACTED]]";
    }
}
