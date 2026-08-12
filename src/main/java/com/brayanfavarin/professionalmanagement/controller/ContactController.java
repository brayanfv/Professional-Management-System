package com.brayanfavarin.professionalmanagement.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.brayanfavarin.professionalmanagement.config.OpenApiConfig;
import com.brayanfavarin.professionalmanagement.dto.common.ApiErrorResponse;
import com.brayanfavarin.professionalmanagement.dto.contact.ContactResponse;
import com.brayanfavarin.professionalmanagement.dto.contact.CreateContactRequest;
import com.brayanfavarin.professionalmanagement.dto.contact.UpdateContactRequest;
import com.brayanfavarin.professionalmanagement.service.ContactService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/professionals/{professionalId}/contacts")
@Tag(name = "Contacts", description = "Contacts belonging to a professional")
@SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
public class ContactController {

    private final ContactService service;

    public ContactController(ContactService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "List a professional's contacts", description = "Contacts always belong to the professional identified by professionalId.")
    public List<ContactResponse> list(@PathVariable Long professionalId) {
        return service.list(professionalId);
    }

    @PostMapping
    @Operation(summary = "Create a contact for a professional")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Contact created"),
            @ApiResponse(responseCode = "400", description = "Invalid request", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Professional not found", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<ContactResponse> create(@PathVariable Long professionalId,
            @Valid @RequestBody CreateContactRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(professionalId, request));
    }

    @PutMapping("/{contactId}")
    @Operation(summary = "Update a contact", description = "The contact must belong to the professional identified by professionalId.")
    public ContactResponse update(@PathVariable Long professionalId, @PathVariable Long contactId,
            @Valid @RequestBody UpdateContactRequest request) {
        return service.update(professionalId, contactId, request);
    }

    @DeleteMapping("/{contactId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete a contact", description = "The contact must belong to the professional identified by professionalId.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Contact deleted"),
            @ApiResponse(responseCode = "404", description = "Contact or professional not found", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public void delete(@PathVariable Long professionalId, @PathVariable Long contactId) {
        service.delete(professionalId, contactId);
    }
}
