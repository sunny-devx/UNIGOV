package gov.sih.unigov;

import com.fasterxml.jackson.databind.ObjectMapper;
import gov.sih.unigov.dto.ApplicationRequest;
import gov.sih.unigov.dto.UserRequest;
import gov.sih.unigov.entity.GovService;
import gov.sih.unigov.entity.User;
import gov.sih.unigov.repository.GovServiceRepository;
import gov.sih.unigov.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class UnigovIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private GovServiceRepository govServiceRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("GET /api/services returns list of federated services")
    void testGetServices() throws Exception {
        mockMvc.perform(get("/api/services"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[0].title", notNullValue()))
                .andExpect(jsonPath("$[0].department", notNullValue()));
    }

    @Test
    @DisplayName("POST /api/users registers a new citizen")
    void testCreateUser() throws Exception {
        String uniqueEmail = "priya.verma." + System.currentTimeMillis() + "@citizen.unigov.in";
        UserRequest request = new UserRequest(
                null,
                "Priya Verma",
                uniqueEmail,
                "+91 91234 56789",
                "House 12, Indiranagar",
                "Karnataka",
                "560038",
                "CITIZEN"
        );

        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.citizenId", startsWith("CID-2026-")))
                .andExpect(jsonPath("$.fullName").value("Priya Verma"))
                .andExpect(jsonPath("$.email").value(uniqueEmail));
    }

    @Test
    @DisplayName("POST /api/applications submits an application and routes to department")
    void testSubmitApplication() throws Exception {
        User user = userRepository.findAll().get(0);
        GovService service = govServiceRepository.findAll().get(0);

        ApplicationRequest appRequest = new ApplicationRequest(
                user.getId(),
                user.getCitizenId(),
                service.getId(),
                user.getFullName(),
                "{\"income\":\"450000\",\"purpose\":\"Academic Fee Waiver\"}",
                "Integration test submission"
        );

        mockMvc.perform(post("/api/applications")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(appRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.trackingNumber", startsWith("UG-2026-")))
                .andExpect(jsonPath("$.status").value("SUBMITTED"))
                .andExpect(jsonPath("$.departmentRefNumber", notNullValue()))
                .andExpect(jsonPath("$.serviceTitle").value(service.getTitle()));
    }

    @Test
    @DisplayName("POST /api/smart/recommend provides AI recommendations")
    void testAiRecommendations() throws Exception {
        Map<String, String> queryPayload = new HashMap<>();
        queryPayload.put("query", "driving license vehicle transport");

        mockMvc.perform(post("/api/smart/recommend")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(queryPayload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.recommendations", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.aiSummary", notNullValue()));
    }

    @Test
    @DisplayName("GET /api/smart/stats returns platform metrics")
    void testGetStats() throws Exception {
        mockMvc.perform(get("/api/smart/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalServices", greaterThanOrEqualTo(1)))
                .andExpect(jsonPath("$.interopGatewayStatus").value("ONLINE"));
    }
}
