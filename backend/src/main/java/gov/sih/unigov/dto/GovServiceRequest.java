package gov.sih.unigov.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public class GovServiceRequest {

    private String serviceCode;

    @NotBlank(message = "Service title is required")
    private String title;

    @NotBlank(message = "Department is required")
    private String department;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Processing days is required")
    private Integer processingDays;

    @PositiveOrZero(message = "Fee must be 0 or positive")
    private Double fee = 0.0;

    private String requiredDocs;

    private String status = "ACTIVE";

    public GovServiceRequest() {
    }

    public String getServiceCode() {
        return serviceCode;
    }

    public void setServiceCode(String serviceCode) {
        this.serviceCode = serviceCode;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getProcessingDays() {
        return processingDays;
    }

    public void setProcessingDays(Integer processingDays) {
        this.processingDays = processingDays;
    }

    public Double getFee() {
        return fee;
    }

    public void setFee(Double fee) {
        this.fee = fee;
    }

    public String getRequiredDocs() {
        return requiredDocs;
    }

    public void setRequiredDocs(String requiredDocs) {
        this.requiredDocs = requiredDocs;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
