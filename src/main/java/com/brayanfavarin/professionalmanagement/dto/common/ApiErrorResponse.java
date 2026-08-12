package com.brayanfavarin.professionalmanagement.dto.common;

import java.time.OffsetDateTime;
import java.util.Map;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Standard API error response. Validation failures may include a field-to-message map.")
public record ApiErrorResponse(
        @Schema(example = "2026-08-11T18:00:00Z") OffsetDateTime timestamp,
        @Schema(example = "404") int status,
        @Schema(example = "Not Found") String error,
        @Schema(example = "PROFESSIONAL_NOT_FOUND") String code,
        @Schema(example = "Professional not found") String message,
        @Schema(example = "/api/professionals/10") String path,
        @Schema(example = "{\"name\":\"Name is required\"}") Map<String, String> fields) {
}
