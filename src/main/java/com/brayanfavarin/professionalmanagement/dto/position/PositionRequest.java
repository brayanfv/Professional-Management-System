package com.brayanfavarin.professionalmanagement.dto.position;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Position create or update data")
public record PositionRequest(
        @NotBlank @Size(max = 120) @Schema(example = "Software Developer") String name,
        @Size(max = 500) @Schema(example = "Responsible for software development") String description) {
}
