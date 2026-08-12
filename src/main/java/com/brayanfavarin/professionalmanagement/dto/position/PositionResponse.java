package com.brayanfavarin.professionalmanagement.dto.position;

import java.time.OffsetDateTime;

public record PositionResponse(Long id, String name, String description, OffsetDateTime createdAt,
        OffsetDateTime updatedAt) {
}
