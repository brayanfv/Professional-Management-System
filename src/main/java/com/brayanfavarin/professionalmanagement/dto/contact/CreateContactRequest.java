package com.brayanfavarin.professionalmanagement.dto.contact;

import com.brayanfavarin.professionalmanagement.enums.ContactType;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Schema(description = "Contact data for the professional identified by the URL")
public record CreateContactRequest(
        @NotNull @Schema(example = "EMAIL") ContactType type,
        @NotBlank @Size(max = 255) @Schema(example = "brayan@example.com") String value,
        @Size(max = 80) @Schema(example = "Professional") String label) {
}
