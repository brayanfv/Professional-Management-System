package com.brayanfavarin.professionalmanagement.exception;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.LinkedHashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import com.brayanfavarin.professionalmanagement.dto.common.ApiErrorResponse;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ApiErrorResponse> validation(MethodArgumentNotValidException ex, HttpServletRequest req) {
        Map<String, String> fields = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(error -> fields.put(error.getField(), error.getDefaultMessage()));
        return response(HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", "Validation failed", req, fields);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    ResponseEntity<ApiErrorResponse> notFound(ResourceNotFoundException ex, HttpServletRequest req) {
        return response(HttpStatus.NOT_FOUND, ex.getCode(), ex.getMessage(), req, null);
    }

    @ExceptionHandler(NoResourceFoundException.class)
    ResponseEntity<ApiErrorResponse> noStaticResource(NoResourceFoundException ex, HttpServletRequest req) {
        return response(HttpStatus.NOT_FOUND, "RESOURCE_NOT_FOUND", "Resource not found", req, null);
    }

    @ExceptionHandler(ConflictException.class)
    ResponseEntity<ApiErrorResponse> conflict(ConflictException ex, HttpServletRequest req) {
        return response(HttpStatus.CONFLICT, ex.getCode(), ex.getMessage(), req, null);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiErrorResponse> dataIntegrity(DataIntegrityViolationException ex, HttpServletRequest req) {
        IntegrityError error = integrityError(ex);
        log.warn("Data integrity conflict while processing {} {}", req.getMethod(), req.getRequestURI());
        return response(HttpStatus.CONFLICT, error.code(), error.message(), req, null);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    ResponseEntity<ApiErrorResponse> invalidCredentials(InvalidCredentialsException ex, HttpServletRequest req) {
        return response(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", "Invalid email or password", req, null);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    ResponseEntity<ApiErrorResponse> constraintViolation(ConstraintViolationException ex, HttpServletRequest req) {
        Map<String, String> fields = new LinkedHashMap<>();
        ex.getConstraintViolations()
                .forEach(violation -> fields.put(violation.getPropertyPath().toString(), violation.getMessage()));
        return response(HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", "Validation failed", req, fields);
    }

    @ExceptionHandler({MethodArgumentTypeMismatchException.class, HttpMessageNotReadableException.class,
            IllegalArgumentException.class})
    ResponseEntity<ApiErrorResponse> badRequest(Exception ex, HttpServletRequest req) {
        return response(HttpStatus.BAD_REQUEST, "INVALID_REQUEST", "Invalid request", req, null);
    }

    @ExceptionHandler(Exception.class)
    ResponseEntity<ApiErrorResponse> unexpected(Exception ex, HttpServletRequest req) {
        log.error("Unexpected exception while processing {} {}", req.getMethod(), req.getRequestURI(), ex);
        return response(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_ERROR", "An unexpected error occurred", req, null);
    }

    private ResponseEntity<ApiErrorResponse> response(HttpStatus status, String code, String message,
            HttpServletRequest req, Map<String, String> fields) {
        return ResponseEntity.status(status).body(new ApiErrorResponse(
                OffsetDateTime.now(ZoneOffset.UTC), status.value(), status.getReasonPhrase(), code, message,
                req.getRequestURI(), fields));
    }

    private IntegrityError integrityError(DataIntegrityViolationException exception) {
        if (DatabaseConstraintViolation.isUniqueViolation(exception)) {
            return switch (DatabaseConstraintViolation.constraintName(exception).orElse("")) {
                case DatabaseConstraintViolation.DEPARTMENT_NAME_UNIQUE ->
                    new IntegrityError("DUPLICATE_DEPARTMENT", "Department name already exists");
                case DatabaseConstraintViolation.POSITION_NAME_UNIQUE ->
                    new IntegrityError("DUPLICATE_POSITION", "Position name already exists");
                default -> new IntegrityError("DATA_INTEGRITY_VIOLATION", "The operation conflicts with existing data");
            };
        }

        if (DatabaseConstraintViolation.isForeignKeyViolation(exception,
                DatabaseConstraintViolation.PROFESSIONAL_DEPARTMENT_FOREIGN_KEY)) {
            return new IntegrityError("DEPARTMENT_IN_USE", "Department is in use");
        }
        if (DatabaseConstraintViolation.isForeignKeyViolation(exception,
                DatabaseConstraintViolation.PROFESSIONAL_POSITION_FOREIGN_KEY)) {
            return new IntegrityError("POSITION_IN_USE", "Position is in use");
        }

        return new IntegrityError("DATA_INTEGRITY_VIOLATION", "The operation conflicts with existing data");
    }

    private record IntegrityError(String code, String message) {
    }
}
