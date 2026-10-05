package gov.sih.unigov.repository;

import gov.sih.unigov.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByCitizenId(String citizenId);

    Optional<User> findByEmail(String email);

    boolean existsByCitizenId(String citizenId);

    boolean existsByEmail(String email);
}
