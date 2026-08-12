package com.brayanfavarin.professionalmanagement.dto.contact;

import com.brayanfavarin.professionalmanagement.enums.ContactType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateContactRequest(@NotNull ContactType type, @NotBlank @Size(max = 255) String value,
        @Size(max = 80) String label) {
}
