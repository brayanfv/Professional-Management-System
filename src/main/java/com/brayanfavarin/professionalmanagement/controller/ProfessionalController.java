package com.brayanfavarin.professionalmanagement.controller;

import java.util.Set;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.brayanfavarin.professionalmanagement.config.OpenApiConfig;
import com.brayanfavarin.professionalmanagement.dto.common.ApiErrorResponse;
import com.brayanfavarin.professionalmanagement.dto.common.PageResponse;
import com.brayanfavarin.professionalmanagement.dto.professional.CreateProfessionalRequest;
import com.brayanfavarin.professionalmanagement.dto.professional.ProfessionalDetailsResponse;
import com.brayanfavarin.professionalmanagement.dto.professional.ProfessionalResponse;
import com.brayanfavarin.professionalmanagement.dto.professional.ProfessionalSummaryResponse;
import com.brayanfavarin.professionalmanagement.dto.professional.UpdateProfessionalRequest;
import com.brayanfavarin.professionalmanagement.dto.professional.UpdateProfessionalStatusRequest;
import com.brayanfavarin.professionalmanagement.enums.ProfessionalStatus;
import com.brayanfavarin.professionalmanagement.service.ProfessionalService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/professionals")
@Tag(name = "Professionals", description = "Professional management")
@SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
public class ProfessionalController {

    private static final Set<String> SORTABLE = Set.of("name", "birthDate", "status", "createdAt", "updatedAt");

    private final ProfessionalService service;

    public ProfessionalController(ProfessionalService service) {
        this.service = service;
    }

    @PostMapping
    @Operation(summary = "Create a professional")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Professional created"),
            @ApiResponse(responseCode = "400", description = "Invalid request", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Department or position not found", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<ProfessionalResponse> create(@Valid @RequestBody CreateProfessionalRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @GetMapping
    @Operation(summary = "List professionals", description = "Page starts at 0; size defaults to 10 and accepts 1-100. "
            + "Sort format is field,direction, for example name,asc. Allowed fields: name, birthDate, status, createdAt, updatedAt.")
    @Parameters({
            @Parameter(name = "page", description = "Zero-based page number", example = "0"),
            @Parameter(name = "size", description = "Page size from 1 to 100", example = "10"),
            @Parameter(name = "search", description = "Case-insensitive partial name search", example = "Brayan"),
            @Parameter(name = "status", description = "Professional status", example = "ACTIVE"),
            @Parameter(name = "departmentId", description = "Department identifier", example = "1"),
            @Parameter(name = "positionId", description = "Position identifier", example = "1"),
            @Parameter(name = "sort", description = "Allowed: name, birthDate, status, createdAt, updatedAt", example = "name,asc")
    })
    public PageResponse<ProfessionalSummaryResponse> list(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size, @RequestParam(required = false) String search,
            @RequestParam(required = false) ProfessionalStatus status, @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) Long positionId, @RequestParam(defaultValue = "name,asc") String sort) {
        return service.list(search, status, departmentId, positionId, pageable(page, size, sort, SORTABLE));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get professional details")
    @ApiResponse(responseCode = "404", description = "Professional not found", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    public ProfessionalDetailsResponse get(@PathVariable Long id) {
        return service.get(id);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a professional", description = "Status is changed only through the status endpoint.")
    public ProfessionalResponse update(@PathVariable Long id, @Valid @RequestBody UpdateProfessionalRequest request) {
        return service.update(id, request);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update professional status")
    public ProfessionalResponse status(@PathVariable Long id, @Valid @RequestBody UpdateProfessionalStatusRequest request) {
        return service.updateStatus(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete a professional", description = "Associated contacts are deleted by the configured cascade.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Professional deleted"),
            @ApiResponse(responseCode = "404", description = "Professional not found", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    static PageRequest pageable(int page, int size, String sort, Set<String> allowed) {
        if (page < 0 || size < 1 || size > 100) {
            throw new IllegalArgumentException("Invalid page or size");
        }
        String[] parts = sort.split(",", -1);
        if (parts.length != 2 || !allowed.contains(parts[0])) {
            throw new IllegalArgumentException("Invalid sort field");
        }
        try {
            return PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(parts[1]), parts[0]));
        } catch (IllegalArgumentException exception) {
            throw new IllegalArgumentException("Invalid sort direction");
        }
    }
}
