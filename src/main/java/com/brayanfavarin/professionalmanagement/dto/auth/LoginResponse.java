package com.brayanfavarin.professionalmanagement.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "JWT access token and authenticated user metadata")
public record LoginResponse(
        @Schema(description = "JWT access token", accessMode = Schema.AccessMode.READ_ONLY) String accessToken,
        @Schema(example = "Bearer") String tokenType,
        @Schema(description = "Token lifetime in seconds", example = "3600") long expiresIn,
        AuthenticatedUserResponse user) {

    @Override
    public String toString() {
        return "LoginResponse[accessToken=[REDACTED], tokenType=" + tokenType
                + ", expiresIn=" + expiresIn + ", user=" + user + "]";
    }
}
