package gov.sih.unigov.repository;

import gov.sih.unigov.entity.ServiceApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceApplicationRepository extends JpaRepository<ServiceApplication, Long> {

    Optional<ServiceApplication> findByTrackingNumber(String trackingNumber);

    List<ServiceApplication> findByUserIdOrderByAppliedAtDesc(Long userId);

    List<ServiceApplication> findByCitizenIdOrderByAppliedAtDesc(String citizenId);

    List<ServiceApplication> findByDepartmentOrderByAppliedAtDesc(String department);

    List<ServiceApplication> findAllByOrderByAppliedAtDesc();

    long countByStatus(String status);
}
