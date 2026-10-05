package gov.sih.unigov.dto;

import gov.sih.unigov.entity.GovService;

public class GovServiceResponse {

    private Long id;
    private String serviceCode;
    private String title;
    private String department;
    private String category;
    private String description;
    private Integer processingDays;
    private Double fee;
    private String requiredDocs;
    private String status;

    public GovServiceResponse() {
    }

    public GovServiceResponse(Long id, String serviceCode, String title, String department, String category, String description, Integer processingDays, Double fee, String requiredDocs, String status) {
        this.id = id;
        this.serviceCode = serviceCode;
        this.title = title;
        this.department = department;
        this.category = category;
        this.description = description;
        this.processingDays = processingDays;
        this.fee = fee;
        this.requiredDocs = requiredDocs;
        this.status = status;
    }

    public static GovServiceResponse fromEntity(GovService entity) {
        if (entity == null) return null;
        return new GovServiceResponse(
                entity.getId(),
                entity.getServiceCode(),
                entity.getTitle(),
                entity.getDepartment(),
                entity.getCategory(),
                entity.getDescription(),
                entity.getProcessingDays(),
                entity.getFee(),
                entity.getRequiredDocs(),
                entity.getStatus()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
