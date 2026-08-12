package com.brayanfavarin.professionalmanagement.dto.dashboard;

import java.time.OffsetDateTime;

import com.brayanfavarin.professionalmanagement.dto.common.IdNameResponse;
import com.brayanfavarin.professionalmanagement.enums.ProfessionalStatus;

public record RecentProfessionalResponse(Long id, String name, ProfessionalStatus status,
        IdNameResponse department, IdNameResponse position, OffsetDateTime createdAt) {
}
