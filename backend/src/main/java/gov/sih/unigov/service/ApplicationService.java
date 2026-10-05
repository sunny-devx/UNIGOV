package gov.sih.unigov.service;

import gov.sih.unigov.dto.ApplicationRequest;
import gov.sih.unigov.dto.ApplicationResponse;
import gov.sih.unigov.entity.GovService;
import gov.sih.unigov.entity.ServiceApplication;
import gov.sih.unigov.entity.User;
import gov.sih.unigov.exception.ResourceNotFoundException;
import gov.sih.unigov.integration.DepartmentIntegrationService;
import gov.sih.unigov.repository.GovServiceRepository;
import gov.sih.unigov.repository.ServiceApplicationRepository;
import gov.sih.unigov.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final ServiceApplicationRepository applicationRepository;
    private final GovServiceRepository govServiceRepository;
    private final UserRepository userRepository;
    private final DepartmentIntegrationService integrationService;
    private final Random random = new Random();

    public ApplicationService(ServiceApplicationRepository applicationRepository,
                              GovServiceRepository govServiceRepository,
                              UserRepository userRepository,
                              DepartmentIntegrationService integrationService) {
        this.applicationRepository = applicationRepository;
        this.govServiceRepository = govServiceRepository;
        this.userRepository = userRepository;
        this.integrationService = integrationService;
    }

    @Transactional
    public ApplicationResponse submitApplication(ApplicationRequest request) {
        // 1. Resolve User
        User user = null;
        if (request.getUserId() != null) {
            user = userRepository.findById(request.getUserId()).orElse(null);
        }
        if (user == null && request.getCitizenId() != null) {
            user = userRepository.findByCitizenId(request.getCitizenId()).orElse(null);
        }
        if (user == null) {
            // Default demo citizen fallback if user record is not directly passed
            user = userRepository.findAll().stream().findFirst()
                    .orElseGet(() -> {
                        User fallback = new User("CID-2026-1001", "Aarav Sharma", "aarav.sharma@citizen.unigov.in",
                                "+91 98765 43210", "Sector 42, Civil Lines", "New Delhi", "110001", "CITIZEN");
                        return userRepository.save(fallback);
                    });
        }

        // 2. Resolve Gov Service
        GovService service = govServiceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Government service not found with ID: " + request.getServiceId()));

        // 3. Generate unique UNIGOV Tracking Number
        String trackingNumber;
        do {
            trackingNumber = "UG-2026-" + (random.nextInt(90000) + 10000);
        } while (applicationRepository.findByTrackingNumber(trackingNumber).isPresent());

        // 4. Route via Interoperability Layer
        DepartmentIntegrationService.IntegrationResult interopResult = integrationService.dispatchToDepartment(
                service.getDepartment(),
                service.getTitle(),
                user.getCitizenId(),
                user.getFullName(),
                request.getFormData()
        );

        // 5. Persist Service Application
        ServiceApplication application = new ServiceApplication(
                trackingNumber,
                user.getId(),
                service.getId(),
                user.getFullName(),
                user.getCitizenId(),
                service.getTitle(),
                service.getDepartment(),
                "SUBMITTED",
                request.getFormData() != null ? request.getFormData() : "{}",
                interopResult.getDepartmentRefNumber(),
                request.getRemarks() != null ? request.getRemarks() : "Application submitted via UNIGOV Interoperability Gateway"
        );

        ServiceApplication saved = applicationRepository.save(application);
        return ApplicationResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getAllApplications() {
        return applicationRepository.findAllByOrderByAppliedAtDesc().stream()
                .map(ApplicationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getApplicationsByUserId(Long userId) {
        return applicationRepository.findByUserIdOrderByAppliedAtDesc(userId).stream()
                .map(ApplicationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getApplicationsByCitizenId(String citizenId) {
        return applicationRepository.findByCitizenIdOrderByAppliedAtDesc(citizenId).stream()
                .map(ApplicationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ApplicationResponse getApplicationByTrackingNumber(String trackingNumber) {
        ServiceApplication app = applicationRepository.findByTrackingNumber(trackingNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found for tracking number: " + trackingNumber));
        return ApplicationResponse.fromEntity(app);
    }

    @Transactional(readOnly = true)
    public ApplicationResponse getApplicationById(Long id) {
        ServiceApplication app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));
        return ApplicationResponse.fromEntity(app);
    }

    @Transactional
    public ApplicationResponse updateApplicationStatus(Long id, String newStatus, String remarks) {
        ServiceApplication app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));

        app.setStatus(newStatus);
        if (remarks != null && !remarks.trim().isEmpty()) {
            app.setRemarks(remarks);
        }

        ServiceApplication updated = applicationRepository.save(app);
        return ApplicationResponse.fromEntity(updated);
    }
}
