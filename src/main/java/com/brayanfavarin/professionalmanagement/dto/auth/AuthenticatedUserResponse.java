package com.brayanfavarin.professionalmanagement.dto.auth;

import com.brayanfavarin.professionalmanagement.enums.UserRole;

public record AuthenticatedUserResponse(Long id, String name, String email, UserRole role) {
}
