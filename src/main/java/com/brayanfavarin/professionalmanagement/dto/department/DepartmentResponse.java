package com.brayanfavarin.professionalmanagement.dto.department;

import java.time.OffsetDateTime;

public record DepartmentResponse(Long id, String name, String description, OffsetDateTime createdAt,
        OffsetDateTime updatedAt) {
}
