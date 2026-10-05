package gov.sih.unigov.dto;

import jakarta.validation.constraints.NotNull;

public class ApplicationRequest {

    private Long userId;

    private String citizenId;

    @NotNull(message = "Service ID is required")
    private Long serviceId;

    private String applicantName;

    private String formData;

    private String remarks;

    public ApplicationRequest() {
    }

    public ApplicationRequest(Long userId, String citizenId, Long serviceId, String applicantName, String formData, String remarks) {
        this.userId = userId;
        this.citizenId = citizenId;
        this.serviceId = serviceId;
        this.applicantName = applicantName;
        this.formData = formData;
        this.remarks = remarks;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getCitizenId() {
        return citizenId;
    }

    public void setCitizenId(String citizenId) {
        this.citizenId = citizenId;
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

    public String getFormData() {
        return formData;
    }

    public void setFormData(String formData) {
        this.formData = formData;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
