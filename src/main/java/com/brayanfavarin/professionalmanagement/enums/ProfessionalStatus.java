package com.brayanfavarin.professionalmanagement.enums;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Professional lifecycle status", allowableValues = {"ACTIVE", "INACTIVE"})
public enum ProfessionalStatus {
    ACTIVE,
    INACTIVE
}
