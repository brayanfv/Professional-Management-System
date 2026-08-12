package com.brayanfavarin.professionalmanagement.enums;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Supported contact type", allowableValues = {"EMAIL", "PHONE", "MOBILE", "OTHER"})
public enum ContactType {
    EMAIL,
    PHONE,
    MOBILE,
    OTHER
}
