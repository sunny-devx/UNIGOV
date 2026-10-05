package gov.sih.unigov.dto;

import gov.sih.unigov.entity.ServiceApplication;
import java.time.LocalDateTime;

public class ApplicationResponse {

    private Long id;
    private String trackingNumber;
    private Long userId;
    private Long serviceId;
    private String applicantName;
    private String citizenId;
    private String serviceTitle;
    private String department;
    private String status;
    private String formData;
    private String departmentRefNumber;
    private String remarks;
    private String interopPayload;
    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;

    public ApplicationResponse() {
    }

    public ApplicationResponse(Long id, String trackingNumber, Long userId, Long serviceId, String applicantName, String citizenId, String serviceTitle, String department, String status, String formData, String departmentRefNumber, String remarks, String interopPayload, LocalDateTime appliedAt, LocalDateTime updatedAt) {
        this.id = id;
        this.trackingNumber = trackingNumber;
        this.userId = userId;
        this.serviceId = serviceId;
        this.applicantName = applicantName;
        this.citizenId = citizenId;
        this.serviceTitle = serviceTitle;
        this.department = department;
        this.status = status;
        this.formData = formData;
        this.departmentRefNumber = departmentRefNumber;
        this.remarks = remarks;
        this.interopPayload = interopPayload;
        this.appliedAt = appliedAt;
        this.updatedAt = updatedAt;
    }

    public static ApplicationResponse fromEntity(ServiceApplication entity) {
        if (entity == null) return null;
        return new ApplicationResponse(
                entity.getId(),
                entity.getTrackingNumber(),
                entity.getUserId(),
                entity.getServiceId(),
                entity.getApplicantName(),
                entity.getCitizenId(),
                entity.getServiceTitle(),
                entity.getDepartment(),
                entity.getStatus(),
                entity.getFormData(),
                entity.getDepartmentRefNumber(),
                entity.getRemarks(),
                entity.getInteropPayload(),
                entity.getAppliedAt(),
                entity.getUpdatedAt()
        );
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
