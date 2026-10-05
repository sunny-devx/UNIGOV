package gov.sih.unigov.repository;

import gov.sih.unigov.entity.GovService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GovServiceRepository extends JpaRepository<GovService, Long> {

    Optional<GovService> findByServiceCode(String serviceCode);

    List<GovService> findByDepartmentIgnoreCase(String department);

    List<GovService> findByCategoryIgnoreCase(String category);

    List<GovService> findByStatus(String status);
}
