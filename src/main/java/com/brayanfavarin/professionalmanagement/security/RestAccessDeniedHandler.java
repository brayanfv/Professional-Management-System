package com.brayanfavarin.professionalmanagement.security;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class RestAccessDeniedHandler implements AccessDeniedHandler {

    private final RestAuthenticationEntryPoint responseWriter;

    public RestAccessDeniedHandler(RestAuthenticationEntryPoint responseWriter) {
        this.responseWriter = responseWriter;
    }

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
            AccessDeniedException accessDeniedException) throws IOException {
        responseWriter.write(response, HttpStatus.FORBIDDEN, "FORBIDDEN", "Access is denied", request.getRequestURI());
    }
}
