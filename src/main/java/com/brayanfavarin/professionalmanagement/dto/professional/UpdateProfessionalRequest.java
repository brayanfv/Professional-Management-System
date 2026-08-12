package com.brayanfavarin.professionalmanagement.dto.professional;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;

public record UpdateProfessionalRequest(@NotBlank @Size(max = 150) String name, @Past LocalDate birthDate,
        Long departmentId, Long positionId) {
}
