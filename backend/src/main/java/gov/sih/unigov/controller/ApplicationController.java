package gov.sih.unigov.controller;

import gov.sih.unigov.dto.ApplicationRequest;
import gov.sih.unigov.dto.ApplicationResponse;
import gov.sih.unigov.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    public ResponseEntity<ApplicationResponse> submitApplication(@Valid @RequestBody ApplicationRequest request) {
        ApplicationResponse created = applicationService.submitApplication(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<ApplicationResponse>> getApplications(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String citizenId) {
        if (userId != null) {
            return ResponseEntity.ok(applicationService.getApplicationsByUserId(userId));
        }
        if (citizenId != null && !citizenId.trim().isEmpty()) {
            return ResponseEntity.ok(applicationService.getApplicationsByCitizenId(citizenId.trim()));
        }
        return ResponseEntity.ok(applicationService.getAllApplications());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApplicationResponse> getApplicationById(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getApplicationById(id));
    }

    @GetMapping("/track/{trackingNumber}")
    public ResponseEntity<ApplicationResponse> getApplicationByTrackingNumber(@PathVariable String trackingNumber) {
        return ResponseEntity.ok(applicationService.getApplicationByTrackingNumber(trackingNumber));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApplicationResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        String newStatus = payload.get("status");
        String remarks = payload.get("remarks");
        if (newStatus == null || newStatus.trim().isEmpty()) {
            newStatus = "UNDER_REVIEW";
        }
        return ResponseEntity.ok(applicationService.updateApplicationStatus(id, newStatus.trim(), remarks));
    }
}
