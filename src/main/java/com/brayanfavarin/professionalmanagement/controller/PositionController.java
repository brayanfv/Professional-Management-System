package com.brayanfavarin.professionalmanagement.controller;

import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
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
import com.brayanfavarin.professionalmanagement.dto.position.PositionRequest;
import com.brayanfavarin.professionalmanagement.dto.position.PositionResponse;
import com.brayanfavarin.professionalmanagement.service.PositionService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/positions")
@Tag(name = "Positions", description = "Position management")
@SecurityRequirement(name = OpenApiConfig.SESSION_COOKIE_AUTH)
public class PositionController {

    private static final Set<String> SORTABLE = Set.of("name", "createdAt", "updatedAt");

    private final PositionService service;

    public PositionController(PositionService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "List positions", description = "Supports search and pagination. Page starts at 0; size accepts 1-100. "
            + "Sort fields: name, createdAt, updatedAt.")
    public PageResponse<PositionResponse> list(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size, @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "name,asc") String sort) {
        return service.list(search, ProfessionalController.pageable(page, size, sort, SORTABLE));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a position")
    public PositionResponse get(@PathVariable Long id) {
        return service.get(id);
    }

    @PostMapping
    @Operation(summary = "Create a position")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Position created"),
            @ApiResponse(responseCode = "400", description = "Invalid request", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
            @ApiResponse(responseCode = "409", description = "DUPLICATE_POSITION", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<PositionResponse> create(@Valid @RequestBody PositionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a position")
    @ApiResponse(responseCode = "409", description = "DUPLICATE_POSITION", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    public PositionResponse update(@PathVariable Long id, @Valid @RequestBody PositionRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete a position")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Position deleted"),
            @ApiResponse(responseCode = "404", description = "Position not found", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
            @ApiResponse(responseCode = "409", description = "POSITION_IN_USE", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
