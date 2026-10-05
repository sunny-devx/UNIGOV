package gov.sih.unigov.controller;

import gov.sih.unigov.service.SmartGovernanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/smart")
public class SmartGovernanceController {

    private final SmartGovernanceService smartGovernanceService;

    public SmartGovernanceController(SmartGovernanceService smartGovernanceService) {
        this.smartGovernanceService = smartGovernanceService;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(smartGovernanceService.getPlatformStats());
    }

    @PostMapping("/recommend")
    public ResponseEntity<Map<String, Object>> getRecommendations(@RequestBody(required = false) Map<String, String> payload) {
        String query = "";
        if (payload != null && payload.containsKey("query")) {
            query = payload.get("query");
        }
        return ResponseEntity.ok(smartGovernanceService.getAiRecommendations(query));
    }
}
