package gov.sih.unigov.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "service_applications")
public class ServiceApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tracking_number", unique = true, nullable = false, length = 32)
    private String trackingNumber;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "service_id", nullable = false)
    private Long serviceId;

    @Column(name = "applicant_name", nullable = false, length = 128)
    private String applicantName;

    @Column(name = "citizen_id", nullable = false, length = 32)
    private String citizenId;

    @Column(name = "service_title", nullable = false, length = 128)
    private String serviceTitle;

    @Column(name = "department", nullable = false, length = 128)
    private String department;

    @Column(name = "status", nullable = false, length = 32)
    private String status = "SUBMITTED";

    @Column(name = "form_data", columnDefinition = "TEXT")
    private String formData;

    @Column(name = "department_ref_number", length = 64)
    private String departmentRefNumber;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "interop_payload", columnDefinition = "TEXT")
    private String interopPayload;

    @Column(name = "applied_at", nullable = false, updatable = false)
    private LocalDateTime appliedAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public ServiceApplication() {
    }

    public ServiceApplication(String trackingNumber, Long userId, Long serviceId, String applicantName, String citizenId, String serviceTitle, String department, String status, String formData, String departmentRefNumber, String remarks, String interopPayload) {
        this.trackingNumber = trackingNumber;
        this.userId = userId;
        this.serviceId = serviceId;
        this.applicantName = applicantName;
        this.citizenId = citizenId;
        this.serviceTitle = serviceTitle;
        this.department = department;
        this.status = status != null ? status : "SUBMITTED";
        this.formData = formData;
        this.departmentRefNumber = departmentRefNumber;
        this.remarks = remarks;
        this.interopPayload = interopPayload;
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        if (this.appliedAt == null) {
            this.appliedAt = now;
        }
        if (this.updatedAt == null) {
            this.updatedAt = now;
        }
        if (this.status == null) {
            this.status = "SUBMITTED";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTrackingNumber() {
        return trackingNumber;
    }

    public void setTrackingNumber(String trackingNumber) {
        this.trackingNumber = trackingNumber;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }

    public String getApplicantName() {
        return applicantName;
    }

    public void setApplicantName(String applicantName) {
        this.applicantName = applicantName;
    }

    public String getCitizenId() {
        return citizenId;
    }

    public void setCitizenId(String citizenId) {
        this.citizenId = citizenId;
    }

    public String getServiceTitle() {
        return serviceTitle;
    }

    public void setServiceTitle(String serviceTitle) {
        this.serviceTitle = serviceTitle;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getFormData() {
        return formData;
    }

    public void setFormData(String formData) {
        this.formData = formData;
    }

    public String getDepartmentRefNumber() {
        return departmentRefNumber;
    }

    public void setDepartmentRefNumber(String departmentRefNumber) {
        this.departmentRefNumber = departmentRefNumber;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public String getInteropPayload() {
        return interopPayload;
    }

    public void setInteropPayload(String interopPayload) {
        this.interopPayload = interopPayload;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }

    public void setAppliedAt(LocalDateTime appliedAt) {
        this.appliedAt = appliedAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
