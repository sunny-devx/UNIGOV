package gov.sih.unigov.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "gov_services")
public class GovService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "service_code", unique = true, nullable = false, length = 32)
    private String serviceCode;

    @Column(name = "title", nullable = false, length = 128)
    private String title;

    @Column(name = "department", nullable = false, length = 128)
    private String department;

    @Column(name = "category", nullable = false, length = 64)
    private String category;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "processing_days", nullable = false)
    private Integer processingDays = 7;

    @Column(name = "fee", nullable = false)
    private Double fee = 0.0;

    @Column(name = "required_docs", columnDefinition = "TEXT")
    private String requiredDocs;

    @Column(name = "status", nullable = false, length = 32)
    private String status = "ACTIVE";

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public GovService() {
    }

    public GovService(String serviceCode, String title, String department, String category, String description, Integer processingDays, Double fee, String requiredDocs, String status) {
        this.serviceCode = serviceCode;
        this.title = title;
        this.department = department;
        this.category = category;
        this.description = description;
        this.processingDays = processingDays != null ? processingDays : 7;
        this.fee = fee != null ? fee : 0.0;
        this.requiredDocs = requiredDocs;
        this.status = status != null ? status : "ACTIVE";
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = "ACTIVE";
        }
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
