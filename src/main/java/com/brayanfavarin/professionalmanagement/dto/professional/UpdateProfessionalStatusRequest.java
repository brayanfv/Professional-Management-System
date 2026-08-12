package com.brayanfavarin.professionalmanagement.dto.professional;

import com.brayanfavarin.professionalmanagement.enums.ProfessionalStatus;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Professional status update")
public record UpdateProfessionalStatusRequest(@NotNull @Schema(example = "INACTIVE") ProfessionalStatus status) {
}
