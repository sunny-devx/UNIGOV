package gov.sih.unigov.controller;

import gov.sih.unigov.dto.GovServiceRequest;
import gov.sih.unigov.dto.GovServiceResponse;
import gov.sih.unigov.service.GovServiceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class GovServiceController {

    private final GovServiceService govServiceService;

    public GovServiceController(GovServiceService govServiceService) {
        this.govServiceService = govServiceService;
    }

    @GetMapping
    public ResponseEntity<List<GovServiceResponse>> getAllServices(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String query) {
        return ResponseEntity.ok(govServiceService.getAllServices(department, category, query));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GovServiceResponse> getServiceById(@PathVariable Long id) {
        return ResponseEntity.ok(govServiceService.getServiceById(id));
    }

    @PostMapping
    public ResponseEntity<GovServiceResponse> createService(@Valid @RequestBody GovServiceRequest request) {
        GovServiceResponse created = govServiceService.createService(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
