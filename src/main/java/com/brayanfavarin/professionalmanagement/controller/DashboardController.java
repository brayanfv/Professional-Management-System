package com.brayanfavarin.professionalmanagement.controller;

import java.util.List;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.brayanfavarin.professionalmanagement.config.OpenApiConfig;
import com.brayanfavarin.professionalmanagement.dto.dashboard.DashboardSummaryResponse;
import com.brayanfavarin.professionalmanagement.dto.dashboard.DepartmentProfessionalCountResponse;
import com.brayanfavarin.professionalmanagement.dto.dashboard.PositionProfessionalCountResponse;
import com.brayanfavarin.professionalmanagement.dto.dashboard.RecentProfessionalResponse;
import com.brayanfavarin.professionalmanagement.service.DashboardService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

@RestController
@Validated
@RequestMapping("/api/dashboard")
@Tag(name = "Dashboard", description = "Administrative dashboard metrics")
@SecurityRequirement(name = OpenApiConfig.SESSION_COOKIE_AUTH)
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    @Operation(summary = "Get dashboard summary")
    public DashboardSummaryResponse summary() {
        return dashboardService.summary();
    }

    @GetMapping("/professionals-by-department")
    @Operation(summary = "Get professional counts by department")
    public List<DepartmentProfessionalCountResponse> professionalsByDepartment() {
        return dashboardService.professionalsByDepartment();
    }

    @GetMapping("/professionals-by-position")
    @Operation(summary = "Get professional counts by position")
    public List<PositionProfessionalCountResponse> professionalsByPosition() {
        return dashboardService.professionalsByPosition();
    }

    @GetMapping("/recent-professionals")
    @Operation(summary = "Get recently created professionals")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Recent professionals"),
            @ApiResponse(responseCode = "400", description = "Invalid limit")
    })
    public List<RecentProfessionalResponse> recentProfessionals(
            @RequestParam(defaultValue = "5") @Parameter(description = "Maximum results (1-20; default 5)", example = "5") @Min(value = 1, message = "Limit must be at least 1")
            @Max(value = 20, message = "Limit must not exceed 20") int limit) {
        return dashboardService.recentProfessionals(limit);
    }
}
