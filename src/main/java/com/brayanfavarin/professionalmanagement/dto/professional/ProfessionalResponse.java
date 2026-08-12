package com.brayanfavarin.professionalmanagement.dto.professional;

import java.time.LocalDate;
import java.time.OffsetDateTime;

import com.brayanfavarin.professionalmanagement.dto.common.IdNameResponse;
import com.brayanfavarin.professionalmanagement.enums.ProfessionalStatus;

public record ProfessionalResponse(Long id, String name, LocalDate birthDate, ProfessionalStatus status,
        IdNameResponse department, IdNameResponse position, OffsetDateTime createdAt, OffsetDateTime updatedAt) {
}
