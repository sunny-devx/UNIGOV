package gov.sih.unigov.service;

import gov.sih.unigov.dto.UserRequest;
import gov.sih.unigov.dto.UserResponse;
import gov.sih.unigov.entity.User;
import gov.sih.unigov.exception.DuplicateResourceException;
import gov.sih.unigov.exception.ResourceNotFoundException;
import gov.sih.unigov.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final Random random = new Random();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return UserResponse.fromEntity(user);
    }

    @Transactional(readOnly = true)
    public UserResponse getUserByCitizenId(String citizenId) {
        User user = userRepository.findByCitizenId(citizenId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with Citizen ID: " + citizenId));
        return UserResponse.fromEntity(user);
    }

    @Transactional(readOnly = true)
    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return UserResponse.fromEntity(user);
    }

    @Transactional
    public UserResponse createUser(UserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("User already exists with email: " + request.getEmail());
        }

        String citizenId = request.getCitizenId();
        if (citizenId == null || citizenId.trim().isEmpty()) {
            citizenId = generateUniqueCitizenId();
        } else if (userRepository.existsByCitizenId(citizenId)) {
            throw new DuplicateResourceException("User already exists with Citizen ID: " + citizenId);
        }

        User user = new User(
                citizenId,
                request.getFullName(),
                request.getEmail(),
                request.getPhone(),
                request.getAddress(),
                request.getState(),
                request.getPincode(),
                request.getRole() != null ? request.getRole() : "CITIZEN"
        );

        User saved = userRepository.save(user);
        return UserResponse.fromEntity(saved);
    }

    @Transactional
    public UserResponse updateUser(Long id, UserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (!user.getEmail().equalsIgnoreCase(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already in use: " + request.getEmail());
        }

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setState(request.getState());
        user.setPincode(request.getPincode());
        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }

        User updated = userRepository.save(user);
        return UserResponse.fromEntity(updated);
    }

    @Transactional
    public UserResponse loginOrCreateDemoCitizen(String identifier) {
        // Find by Citizen ID or Email
        Optional<User> byCitizenId = userRepository.findByCitizenId(identifier);
        if (byCitizenId.isPresent()) {
            return UserResponse.fromEntity(byCitizenId.get());
        }

        Optional<User> byEmail = userRepository.findByEmail(identifier);
        if (byEmail.isPresent()) {
            return UserResponse.fromEntity(byEmail.get());
        }

        // Create on-the-fly demo citizen if identifier is new
        String generatedCitizenId = generateUniqueCitizenId();
        String name = identifier.contains("@") ? identifier.substring(0, identifier.indexOf('@')) : "Demo Citizen";
        String email = identifier.contains("@") ? identifier : identifier.toLowerCase().replaceAll("[^a-z0-9]", "") + "@citizen.unigov.in";

        User newCitizen = new User(
                generatedCitizenId,
                capitalize(name),
                email,
                "+91 98765 " + String.format("%05d", random.nextInt(100000)),
                "Sector 42, Civil Lines",
                "New Delhi",
                "110001",
                "CITIZEN"
        );

        User saved = userRepository.save(newCitizen);
        return UserResponse.fromEntity(saved);
    }

    private String generateUniqueCitizenId() {
        String cid;
        do {
            cid = "CID-2026-" + String.format("%04d", random.nextInt(9000) + 1000);
        } while (userRepository.existsByCitizenId(cid));
        return cid;
    }

    private String capitalize(String str) {
        if (str == null || str.isEmpty()) return "Citizen";
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    }
}
