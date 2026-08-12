package com.brayanfavarin.professionalmanagement.enums;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Current administrative role", allowableValues = {"ADMIN"})
public enum UserRole {
    ADMIN
}
