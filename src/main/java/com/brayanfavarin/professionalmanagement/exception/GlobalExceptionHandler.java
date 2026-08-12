package com.brayanfavarin.professionalmanagement.exception;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.*;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import com.brayanfavarin.professionalmanagement.dto.common.ApiErrorResponse;

@RestControllerAdvice public class GlobalExceptionHandler {
 @ExceptionHandler(MethodArgumentNotValidException.class) ResponseEntity<ApiErrorResponse> validation(MethodArgumentNotValidException ex,HttpServletRequest req){Map<String,String> fields=new LinkedHashMap<>();ex.getBindingResult().getFieldErrors().forEach(e->fields.put(e.getField(),e.getDefaultMessage()));return response(HttpStatus.BAD_REQUEST,"VALIDATION_ERROR","Validation failed",req,fields);}
 @ExceptionHandler(ResourceNotFoundException.class) ResponseEntity<ApiErrorResponse> notFound(ResourceNotFoundException ex,HttpServletRequest req){return response(HttpStatus.NOT_FOUND,ex.getCode(),ex.getMessage(),req,null);}
 @ExceptionHandler(ConflictException.class) ResponseEntity<ApiErrorResponse> conflict(ConflictException ex,HttpServletRequest req){return response(HttpStatus.CONFLICT,ex.getCode(),ex.getMessage(),req,null);}
 @ExceptionHandler(InvalidCredentialsException.class) ResponseEntity<ApiErrorResponse> invalidCredentials(InvalidCredentialsException ex,HttpServletRequest req){return response(HttpStatus.UNAUTHORIZED,"INVALID_CREDENTIALS","Invalid email or password",req,null);}
 @ExceptionHandler(ConstraintViolationException.class) ResponseEntity<ApiErrorResponse> constraintViolation(ConstraintViolationException ex,HttpServletRequest req){Map<String,String> fields=new LinkedHashMap<>();ex.getConstraintViolations().forEach(v->fields.put(v.getPropertyPath().toString(),v.getMessage()));return response(HttpStatus.BAD_REQUEST,"VALIDATION_ERROR","Validation failed",req,fields);}
 @ExceptionHandler({MethodArgumentTypeMismatchException.class,HttpMessageNotReadableException.class,IllegalArgumentException.class}) ResponseEntity<ApiErrorResponse> badRequest(Exception ex,HttpServletRequest req){return response(HttpStatus.BAD_REQUEST,"INVALID_REQUEST","Invalid request",req,null);}
 @ExceptionHandler(Exception.class) ResponseEntity<ApiErrorResponse> unexpected(Exception ex,HttpServletRequest req){return response(HttpStatus.INTERNAL_SERVER_ERROR,"INTERNAL_ERROR","An unexpected error occurred",req,null);}
 private ResponseEntity<ApiErrorResponse> response(HttpStatus status,String code,String message,HttpServletRequest req,Map<String,String> fields){return ResponseEntity.status(status).body(new ApiErrorResponse(OffsetDateTime.now(ZoneOffset.UTC),status.value(),status.getReasonPhrase(),code,message,req.getRequestURI(),fields));}
}
