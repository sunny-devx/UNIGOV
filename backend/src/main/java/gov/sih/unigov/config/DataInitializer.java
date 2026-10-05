package gov.sih.unigov.config;

import gov.sih.unigov.entity.GovService;
import gov.sih.unigov.entity.ServiceApplication;
import gov.sih.unigov.entity.User;
import gov.sih.unigov.repository.GovServiceRepository;
import gov.sih.unigov.repository.ServiceApplicationRepository;
import gov.sih.unigov.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final GovServiceRepository govServiceRepository;
    private final UserRepository userRepository;
    private final ServiceApplicationRepository applicationRepository;

    public DataInitializer(GovServiceRepository govServiceRepository,
                           UserRepository userRepository,
                           ServiceApplicationRepository applicationRepository) {
        this.govServiceRepository = govServiceRepository;
        this.userRepository = userRepository;
        this.applicationRepository = applicationRepository;
    }

    @Override
    public void run(String... args) {
        // Seed default demo citizen (Aarav Sharma)
        User demoUser;
        if (!userRepository.existsByCitizenId("CID-2026-1001")) {
            demoUser = new User(
                    "CID-2026-1001",
                    "Aarav Sharma",
                    "aarav.sharma@citizen.unigov.in",
                    "+91 98765 43210",
                    "Flat 402, Shanti Heights, Sector 18",
                    "Delhi NCR",
                    "110001",
                    "CITIZEN"
            );
            demoUser = userRepository.save(demoUser);
            log.info("[DATA INIT] Initialized demo citizen Aarav Sharma (CID-2026-1001)");
        } else {
            demoUser = userRepository.findByCitizenId("CID-2026-1001").orElse(null);
        }

        // Seed second demo citizen (Priya Verma - Student Persona)
        if (!userRepository.existsByCitizenId("CID-2026-1002")) {
            User studentUser = new User(
                    "CID-2026-1002",
                    "Priya Verma",
                    "priya.verma@citizen.unigov.in",
                    "+91 91234 56789",
                    "House 12, Indiranagar, 2nd Main",
                    "Karnataka",
                    "560038",
                    "CITIZEN"
            );
            userRepository.save(studentUser);
            log.info("[DATA INIT] Initialized demo citizen Priya Verma (CID-2026-1002)");
        }

        // Seed federated government services
        if (govServiceRepository.count() == 0) {
            GovService s1 = new GovService(
                    "SRV-REV-101",
                    "Income & Asset Certificate",
                    "Revenue & Land Administration",
                    "Certificates",
                    "Official certificate confirming annual family income and economic assets for educational and scholarship benefits.",
                    5,
                    50.0,
                    "Aadhaar Card, Salary Slip / Form 16, Land Record / Electricity Bill",
                    "ACTIVE"
            );

            GovService s2 = new GovService(
                    "SRV-TRN-201",
                    "Driving License Renewal",
                    "Transport & Highway Authority (Sarathi)",
                    "Transport",
                    "Seamless online renewal of expired non-transport / transport driving licenses with biometric verification.",
                    3,
                    200.0,
                    "Current Driving License, Medical Fitness Form 1A, Proof of Age",
                    "ACTIVE"
            );

            GovService s3 = new GovService(
                    "SRV-FCS-301",
                    "NFSA Priority Ration Card",
                    "Food & Civil Supplies Department",
                    "Welfare",
                    "National Food Security Act (NFSA) ration card issuance for subsidized grain allocation and family quota registry.",
                    12,
                    0.0,
                    "Family Photograph, LPG Connection Proof, Income Certificate",
                    "ACTIVE"
            );

            GovService s4 = new GovService(
                    "SRV-MUN-401",
                    "Municipal Water Supply Connection",
                    "Urban Local Bodies & Municipal Corporation",
                    "Civic Services",
                    "Sanction and pipeline installation of domestic drinking water connection with digital pressure meter.",
                    7,
                    500.0,
                    "Property Tax Receipt, Ownership Title Deed, Site Plan",
                    "ACTIVE"
            );

            GovService s5 = new GovService(
                    "SRV-SWD-501",
                    "Old Age Social Security Pension",
                    "Social Justice & Empowerment",
                    "Pension",
                    "Monthly direct bank transfer pension for senior citizens above 60 years under national social assistance program.",
                    15,
                    0.0,
                    "Age Certificate (60+), Bank Passbook, Aadhaar, BPL Verification",
                    "ACTIVE"
            );

            GovService s6 = new GovService(
                    "SRV-REV-102",
                    "Permanent Domicile Certificate",
                    "Revenue & District Administration",
                    "Certificates",
                    "State domicile and residency certification for state quota government examinations and recruitment.",
                    5,
                    40.0,
                    "10-Year Continuous Residence Proof, School Leaving Certificate, Voter ID",
                    "ACTIVE"
            );

            govServiceRepository.save(s1);
            govServiceRepository.save(s2);
            govServiceRepository.save(s3);
            govServiceRepository.save(s4);
            govServiceRepository.save(s5);
            govServiceRepository.save(s6);
            log.info("[DATA INIT] Initialized 6 federated government services across departments");
        }

        // Seed initial demo application for instant tracking
        if (applicationRepository.count() == 0 && demoUser != null) {
            GovService s1 = govServiceRepository.findAll().stream().findFirst().orElse(null);
            if (s1 != null) {
                String sampleInterop = "{\"interopVersion\":\"UNIGOV-INTEROP-v1.0\",\"targetSystem\":\"Revenue & Land Administration\",\"destinationRefId\":\"REV-PORTAL-89104\",\"status\":\"ACCEPTED_BY_DEPARTMENT\"}";
                ServiceApplication initialApp = new ServiceApplication(
                        "UG-2026-78412",
                        demoUser.getId(),
                        s1.getId(),
                        demoUser.getFullName(),
                        demoUser.getCitizenId(),
                        s1.getTitle(),
                        s1.getDepartment(),
                        "UNDER_REVIEW",
                        "{\"annualIncome\":\"320000\",\"purpose\":\"Higher Education Scholarship\"}",
                        "REV-PORTAL-89104",
                        "Interoperability gateway forwarded application to Tahsildar Office. Digital verification passed.",
                        sampleInterop
                );
                applicationRepository.save(initialApp);
                log.info("[DATA INIT] Initialized demo application (UG-2026-78412)");
            }
        }
    }
}
