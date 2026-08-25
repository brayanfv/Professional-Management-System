package com.brayanfavarin.professionalmanagement.security;

import java.io.IOException;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.filter.OncePerRequestFilter;

import com.brayanfavarin.professionalmanagement.dto.common.ApiErrorResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class LoginRateLimitFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(LoginRateLimitFilter.class);
    private static final String LOGIN_PATH = "/api/auth/login";

    private final LoginRateLimiter limiter;
    private final ClientIpResolver clientIpResolver;
    private final ObjectMapper objectMapper;

    public LoginRateLimitFilter(LoginRateLimiter limiter, ClientIpResolver clientIpResolver, ObjectMapper objectMapper) {
        this.limiter = limiter;
        this.clientIpResolver = clientIpResolver;
        this.objectMapper = objectMapper;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !"POST".equalsIgnoreCase(request.getMethod()) || !LOGIN_PATH.equals(request.getRequestURI());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        LoginRateLimiter.LoginRateLimitResult result = limiter.tryConsume(clientIpResolver.resolve(request));
        if (result.allowed()) {
            filterChain.doFilter(request, response);
            return;
        }

        long retryAfterSeconds = Math.max(1, TimeUnit.NANOSECONDS.toSeconds(result.nanosToWaitForRefill()));
        if (TimeUnit.SECONDS.toNanos(retryAfterSeconds) < result.nanosToWaitForRefill()) {
            retryAfterSeconds++;
        }

        log.warn("Login rate limit exceeded");
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setHeader(HttpHeaders.RETRY_AFTER, Long.toString(retryAfterSeconds));
        objectMapper.writeValue(response.getOutputStream(), new ApiErrorResponse(
                OffsetDateTime.now(ZoneOffset.UTC),
                HttpStatus.TOO_MANY_REQUESTS.value(),
                HttpStatus.TOO_MANY_REQUESTS.getReasonPhrase(),
                "TOO_MANY_LOGIN_ATTEMPTS",
                "Too many sign-in attempts. Try again later.",
                request.getRequestURI(),
                null));
    }
}
