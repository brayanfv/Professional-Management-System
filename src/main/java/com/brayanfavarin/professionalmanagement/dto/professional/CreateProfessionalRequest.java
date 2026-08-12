package com.brayanfavarin.professionalmanagement.dto.professional;

import java.time.LocalDate;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;

@Schema(description = "Data required to create a professional. Status and audit fields are server-managed.")
public record CreateProfessionalRequest(
        @NotBlank @Size(max = 150) @Schema(example = "Brayan Favarin") String name,
        @Past @Schema(example = "2004-11-17") LocalDate birthDate,
        @Schema(description = "Existing department identifier", example = "1") Long departmentId,
        @Schema(description = "Existing position identifier", example = "1") Long positionId) {
}
