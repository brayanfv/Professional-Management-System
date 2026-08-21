package com.brayanfavarin.professionalmanagement.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.brayanfavarin.professionalmanagement.config.OpenApiConfig;
import com.brayanfavarin.professionalmanagement.dto.auth.AuthenticatedUserResponse;
import com.brayanfavarin.professionalmanagement.dto.auth.LoginRequest;
import com.brayanfavarin.professionalmanagement.dto.auth.LoginResponse;
import com.brayanfavarin.professionalmanagement.dto.common.ApiErrorResponse;
import com.brayanfavarin.professionalmanagement.security.AuthenticatedSession;
import com.brayanfavarin.professionalmanagement.security.SessionCookieService;
import com.brayanfavarin.professionalmanagement.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Authentication and current session")
public class AuthController {

    private final AuthService authService;
    private final SessionCookieService sessionCookieService;

    public AuthController(AuthService authService, SessionCookieService sessionCookieService) {
        this.authService = authService;
        this.sessionCookieService = sessionCookieService;
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate an administrator", description = "Creates an HttpOnly browser session cookie.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Authenticated"),
            @ApiResponse(responseCode = "400", description = "Invalid request", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "Invalid credentials", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthenticatedSession session = authService.login(request);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, sessionCookieService.sessionCookie(session.token()).toString())
                .body(new LoginResponse(session.user()));
    }

    @GetMapping("/me")
    @Operation(summary = "Get the authenticated user")
    @SecurityRequirement(name = OpenApiConfig.SESSION_COOKIE_AUTH)
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Authenticated user"),
            @ApiResponse(responseCode = "401", description = "Authentication is required", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "Administrator role is required", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public AuthenticatedUserResponse me(@AuthenticationPrincipal UserDetails user) {
        return authService.authenticatedUser(user.getUsername());
    }

    @PostMapping("/logout")
    @Operation(summary = "Log out", description = "Expires the browser session cookie.")
    @SecurityRequirement(name = OpenApiConfig.SESSION_COOKIE_AUTH)
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Token discard acknowledged"),
            @ApiResponse(responseCode = "401", description = "Authentication is required", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<Void> logout() {
        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, sessionCookieService.expiredSessionCookie().toString())
                .build();
    }
}
