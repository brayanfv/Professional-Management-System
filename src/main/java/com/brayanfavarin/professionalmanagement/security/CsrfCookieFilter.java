package com.brayanfavarin.professionalmanagement.security;

import java.io.IOException;

import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.web.cors.CorsUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/** Materializes Spring Security's deferred CSRF token for browser bootstrap responses. */
public class CsrfCookieFilter extends OncePerRequestFilter {

    private final CsrfTokenRepository csrfTokenRepository;

    public CsrfCookieFilter(CsrfTokenRepository csrfTokenRepository) {
        this.csrfTokenRepository = csrfTokenRepository;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // A CORS preflight must not rotate the double-submit cookie between the
        // browser preparing the mutation header and the actual POST/PUT/etc.
        return CorsUtils.isPreFlightRequest(request);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        materializeToken(request, response);
        filterChain.doFilter(request, response);
    }

    private void materializeToken(HttpServletRequest request, HttpServletResponse response) {
        csrfTokenRepository.loadDeferredToken(request, response).get();
    }
}
