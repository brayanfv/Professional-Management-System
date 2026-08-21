package com.brayanfavarin.professionalmanagement.service;

final class InputNormalizer {

    private InputNormalizer() {
    }

    static String required(String value) {
        String normalized = value == null ? null : value.trim();
        if (normalized == null || normalized.isEmpty()) {
            throw new IllegalArgumentException("Required text must not be blank");
        }
        return normalized;
    }

    static String optional(String value) {
        if (value == null) {
            return null;
        }

        String normalized = value.trim();
        return normalized.isEmpty() ? null : normalized;
    }
}
