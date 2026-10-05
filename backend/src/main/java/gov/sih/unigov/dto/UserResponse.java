package gov.sih.unigov.dto;

import gov.sih.unigov.entity.User;
import java.time.LocalDateTime;

public class UserResponse {

    private Long id;
    private String citizenId;
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private String state;
    private String pincode;
    private String role;
    private LocalDateTime createdAt;

    public UserResponse() {
    }

    public UserResponse(Long id, String citizenId, String fullName, String email, String phone, String address, String state, String pincode, String role, LocalDateTime createdAt) {
        this.id = id;
        this.citizenId = citizenId;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.state = state;
        this.pincode = pincode;
        this.role = role;
        this.createdAt = createdAt;
    }

    public static UserResponse fromEntity(User user) {
        if (user == null) {
            return null;
        }
        return new UserResponse(
                user.getId(),
                user.getCitizenId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getAddress(),
                user.getState(),
                user.getPincode(),
                user.getRole(),
                user.getCreatedAt()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCitizenId() {
        return citizenId;
    }

    public void setCitizenId(String citizenId) {
        this.citizenId = citizenId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
