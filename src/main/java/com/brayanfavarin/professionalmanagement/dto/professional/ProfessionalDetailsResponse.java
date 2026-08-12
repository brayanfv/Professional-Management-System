package com.brayanfavarin.professionalmanagement.dto.professional;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

import com.brayanfavarin.professionalmanagement.dto.common.IdNameResponse;
import com.brayanfavarin.professionalmanagement.dto.contact.ContactResponse;
import com.brayanfavarin.professionalmanagement.enums.ProfessionalStatus;

public record ProfessionalDetailsResponse(Long id, String name, LocalDate birthDate, ProfessionalStatus status,
        IdNameResponse department, IdNameResponse position, List<ContactResponse> contacts, OffsetDateTime createdAt,
        OffsetDateTime updatedAt) {
}
