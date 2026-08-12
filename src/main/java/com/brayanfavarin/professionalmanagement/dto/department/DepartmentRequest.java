package com.brayanfavarin.professionalmanagement.dto.department;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Department create or update data")
public record DepartmentRequest(
        @NotBlank @Size(max = 120) @Schema(example = "Technology") String name,
        @Size(max = 500) @Schema(example = "Technology department") String description) {
}
