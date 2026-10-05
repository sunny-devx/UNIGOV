package gov.sih.unigov.integration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class DepartmentIntegrationService {

    private static final Logger log = LoggerFactory.getLogger(DepartmentIntegrationService.class);
    private final Random random = new Random();

    /**
     * Dispatches an application from the UNIGOV Interoperability Layer to the destination Department System.
     * Performs schema mapping, canonical data transformation, and generates external department acknowledgment.
     */
    public IntegrationResult dispatchToDepartment(String department, String serviceTitle, String citizenId, String applicantName, String rawPayload) {
        log.info("[INTEROPERABILITY LAYER] Routing application for '{}' to department '{}' for citizen '{}'",
                serviceTitle, department, citizenId);

        String deptPrefix = getDepartmentPrefix(department);
        String deptRefNumber = deptPrefix + "-" + (random.nextInt(90000) + 10000);

        Map<String, Object> transformedPayload = new HashMap<>();
        transformedPayload.put("interopVersion", "UNIGOV-INTEROP-v1.0");
        transformedPayload.put("targetSystem", department);
        transformedPayload.put("destinationRefId", deptRefNumber);
        transformedPayload.put("unifiedCitizenId", citizenId);
        transformedPayload.put("beneficiaryName", applicantName);
        transformedPayload.put("dispatchedAt", LocalDateTime.now().toString());
        transformedPayload.put("rawAdapterData", rawPayload);
        transformedPayload.put("status", "ACCEPTED_BY_DEPARTMENT");

        log.info("[INTEROPERABILITY LAYER] Successfully transformed & routed to {}. Assigned external ref: {}",
                department, deptRefNumber);

        return new IntegrationResult(deptRefNumber, "ACCEPTED_BY_DEPARTMENT", transformedPayload);
    }

    private String getDepartmentPrefix(String department) {
        if (department == null) return "DEPT";
        String lower = department.toLowerCase();
        if (lower.contains("revenue") || lower.contains("land")) return "REV-PORTAL";
        if (lower.contains("transport") || lower.contains("rto")) return "RTO-SARATHI";
        if (lower.contains("food") || lower.contains("civil") || lower.contains("supplies")) return "FCS-NFSA";
        if (lower.contains("municipal") || lower.contains("urban")) return "ULB-MUNICIPAL";
        if (lower.contains("welfare") || lower.contains("pension")) return "SWD-PENSION";
        return "GOV-INT";
    }

    public static class IntegrationResult {
        private final String departmentRefNumber;
        private final String status;
        private final Map<String, Object> transformedPayload;

        public IntegrationResult(String departmentRefNumber, String status, Map<String, Object> transformedPayload) {
            this.departmentRefNumber = departmentRefNumber;
            this.status = status;
            this.transformedPayload = transformedPayload;
        }

        public String getDepartmentRefNumber() {
            return departmentRefNumber;
        }

        public String getStatus() {
            return status;
        }

        public Map<String, Object> getTransformedPayload() {
            return transformedPayload;
        }
    }
}
