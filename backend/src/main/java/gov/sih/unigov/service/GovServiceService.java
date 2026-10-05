package gov.sih.unigov.service;

import gov.sih.unigov.dto.GovServiceRequest;
import gov.sih.unigov.dto.GovServiceResponse;
import gov.sih.unigov.entity.GovService;
import gov.sih.unigov.exception.DuplicateResourceException;
import gov.sih.unigov.exception.ResourceNotFoundException;
import gov.sih.unigov.repository.GovServiceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class GovServiceService {

    private final GovServiceRepository govServiceRepository;
    private final Random random = new Random();

    public GovServiceService(GovServiceRepository govServiceRepository) {
        this.govServiceRepository = govServiceRepository;
    }

    @Transactional(readOnly = true)
    public List<GovServiceResponse> getAllServices(String department, String category, String query) {
        List<GovService> list;
        if (department != null && !department.trim().isEmpty()) {
            list = govServiceRepository.findByDepartmentIgnoreCase(department.trim());
        } else if (category != null && !category.trim().isEmpty()) {
            list = govServiceRepository.findByCategoryIgnoreCase(category.trim());
        } else {
            list = govServiceRepository.findAll();
        }

        if (query != null && !query.trim().isEmpty()) {
            String q = query.trim().toLowerCase();
            list = list.stream()
                    .filter(s -> s.getTitle().toLowerCase().contains(q)
                            || s.getDescription().toLowerCase().contains(q)
                            || s.getDepartment().toLowerCase().contains(q))
                    .collect(Collectors.toList());
        }

        return list.stream()
                .map(GovServiceResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public GovServiceResponse getServiceById(Long id) {
        GovService service = govServiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Government service not found with ID: " + id));
        return GovServiceResponse.fromEntity(service);
    }

    @Transactional
    public GovServiceResponse createService(GovServiceRequest request) {
        String code = request.getServiceCode();
        if (code == null || code.trim().isEmpty()) {
            code = "SRV-" + request.getDepartment().substring(0, Math.min(3, request.getDepartment().length())).toUpperCase()
                    + "-" + (random.nextInt(900) + 100);
        } else if (govServiceRepository.findByServiceCode(code).isPresent()) {
            throw new DuplicateResourceException("Service with code " + code + " already exists");
        }

        GovService service = new GovService(
                code,
                request.getTitle(),
                request.getDepartment(),
                request.getCategory(),
                request.getDescription(),
                request.getProcessingDays(),
                request.getFee(),
                request.getRequiredDocs(),
                request.getStatus()
        );

        GovService saved = govServiceRepository.save(service);
        return GovServiceResponse.fromEntity(saved);
    }
}
