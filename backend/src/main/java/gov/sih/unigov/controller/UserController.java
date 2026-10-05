package gov.sih.unigov.controller;

import gov.sih.unigov.dto.UserRequest;
import gov.sih.unigov.dto.UserResponse;
import gov.sih.unigov.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/citizen/{citizenId}")
    public ResponseEntity<UserResponse> getUserByCitizenId(@PathVariable String citizenId) {
        return ResponseEntity.ok(userService.getUserByCitizenId(citizenId));
    }

    @PostMapping
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserRequest request) {
        UserResponse response = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @Valid @RequestBody UserRequest request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> loginOrRegisterCitizen(@RequestBody Map<String, String> payload) {
        String identifier = payload.get("identifier");
        if (identifier == null || identifier.trim().isEmpty()) {
            identifier = "aarav.sharma@citizen.unigov.in";
        }
        UserResponse response = userService.loginOrCreateDemoCitizen(identifier.trim());
        return ResponseEntity.ok(response);
    }
}
