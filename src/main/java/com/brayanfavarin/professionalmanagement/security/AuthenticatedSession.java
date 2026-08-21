package com.brayanfavarin.professionalmanagement.security;

import com.brayanfavarin.professionalmanagement.dto.auth.AuthenticatedUserResponse;

/**
 * Internal authentication result. Its token must only be written to the HttpOnly
 * response cookie and must never be serialized as an API response.
 */
public record AuthenticatedSession(String token, AuthenticatedUserResponse user) {

    @Override
    public String toString() {
        return "AuthenticatedSession[token=[REDACTED], user=" + user + "]";
    }
}
