package com.brayanfavarin.professionalmanagement.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Authenticated user metadata. The session token is stored only in an HttpOnly cookie.")
public record LoginResponse(AuthenticatedUserResponse user) {
}
