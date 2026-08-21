package com.brayanfavarin.professionalmanagement.security;

import java.time.Duration;
import java.util.Locale;
import java.util.Set;

import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class SessionCookieService {

    private static final Set<String> SUPPORTED_SAME_SITE_VALUES = Set.of("lax", "strict", "none");

    private final SessionCookieProperties properties;
    private final JwtService jwtService;

    public SessionCookieService(SessionCookieProperties properties, JwtService jwtService) {
        this.properties = properties;
        this.jwtService = jwtService;
        validateProperties();
    }

    public ResponseCookie sessionCookie(String token) {
        return cookieBuilder(token)
                .maxAge(Duration.ofSeconds(jwtService.getExpirationSeconds()))
                .build();
    }

    public ResponseCookie expiredSessionCookie() {
        return cookieBuilder("")
                .maxAge(Duration.ZERO)
                .build();
    }

    public String cookieName() {
        return properties.getCookieName();
    }

    private ResponseCookie.ResponseCookieBuilder cookieBuilder(String value) {
        return ResponseCookie.from(properties.getCookieName(), value)
                .httpOnly(true)
                .secure(properties.isSecure())
                .sameSite(properties.getSameSite())
                .path("/");
    }

    private void validateProperties() {
        String cookieName = properties.getCookieName();
        if (cookieName == null || cookieName.isBlank()) {
            throw new IllegalStateException("Session cookie name must not be blank");
        }

        String sameSite = properties.getSameSite();
        if (sameSite == null || !SUPPORTED_SAME_SITE_VALUES.contains(sameSite.toLowerCase(Locale.ROOT))) {
            throw new IllegalStateException("Session cookie SameSite must be Lax, Strict, or None");
        }
        if ("none".equalsIgnoreCase(sameSite) && !properties.isSecure()) {
            throw new IllegalStateException("SameSite=None session cookies require Secure=true");
        }
    }
}
