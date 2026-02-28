# SIS Audit Coverage vs. Industry Data Models

## A Cross-Reference for Higher Education Data Integrity

*ERPize — The ERP Magazine*
*Published: February 2026*

---

## Purpose

Every Student Information System stores the same fundamental data: students, courses, enrollments, grades, financial aid, and compliance records. The specific table names differ between platforms, but the *entities* and *audit concerns* are universal.

This document maps common SIS audit checks against the [Microsoft Education Accelerator Common Data Model](https://github.com/microsoft/Industry-Accelerator-Education) (open-source, MIT-licensed, archived Jan 2024) — not because any institution runs that exact schema, but because it provides a vendor-neutral reference point for the entities every SIS must support.

The goal: define **what to audit** independent of **which platform you run**.

---

## Microsoft Education Accelerator CDM — Entity Reference

The Higher Education component of Microsoft's Common Data Model defines 31 entities across five domains:

### Academic Structure

| CDM Entity | Purpose |
|------------|---------|
| AcademicPeriod | Terms, semesters, sessions |
| AcademicPeriodDetail | Student ↔ term status |
| Course | Master course catalog |
| CourseHistory | Student transcript records |
| CourseSection | Instructor ↔ course assignments |
| RegistrationStatus | Enrollment status codes |
| Program | Degree programs |
| ProgramLevel | Degree levels (AA, BA, MA, PhD) |
| ProgramVersion | Program catalog versions |
| ProgramVersionDetail | Version effective dates |
| StudentProgramType | Major, minor, concentration |
| StudentStatus | Active, withdrawn, graduated, etc. |
| EducationLevel | Credential levels |
| AreaOfInterest | Subject groupings (broad) |
| AreaOfStudy | Specific program offerings |

### People & Accounts

| CDM Entity | Purpose |
|------------|---------|
| Account | Institutions, employers, partners |
| Contact | Students, faculty, staff, parents |
| Address | Additional address records |

### Financial Awards

| CDM Entity | Purpose |
|------------|---------|
| Grant | Grant offerings |
| GrantApplicant | Student grant applications |
| Scholarship | Scholarship offerings |
| ScholarshipApplicant | Student scholarship applications |
| GrantApplicationBusinessProcessFlow | Grant workflow tracking |
| ScholarshipApplicationBusinessProcessFlow | Scholarship workflow tracking |

### Student Experience

| CDM Entity | Purpose |
|------------|---------|
| Internship | Internship offerings |
| InternshipApplicant | Student internship applications |
| InternshipApplicationFlow | Internship workflow tracking |
| ExtraCurricularActivity | Activities master list |
| ExtraCurricularParticipant | Student ↔ activity enrollment |
| Accomplishments | Student achievements |
| PreviousEducation | Prior education history |
| TestScore / TestType | Standardized test records |

---

## Audit Check Mapping: CDM Entities → Audit Categories

This is the core reference. Each row maps an audit concern to the CDM entities it would touch, and flags whether the CDM actually models the data needed for that audit.

### Section 1: Enrollment Validation

| Audit Check | CDM Entities Involved | CDM Coverage |
|------------|----------------------|--------------|
| Active enrollments with no course registrations | AcademicPeriodDetail, CourseHistory, StudentStatus | ⚠️ Partial — CDM has the entities but no enrollment validation rules |
| Students enrolled in future terms with past-term status | AcademicPeriodDetail, AcademicPeriod, StudentStatus | ⚠️ Partial — requires cross-entity date logic |
| Enrollment status mismatches between systems | RegistrationStatus, StudentStatus | ⚠️ Partial — CDM doesn't model system-of-record conflicts |

### Section 2: Academic Standing

| Audit Check | CDM Entities Involved | CDM Coverage |
|------------|----------------------|--------------|
| GPA calculations vs. posted standing | CourseHistory, StudentStatus | ⚠️ Partial — CDM has grade data but no standing calculation logic |
| Credit hour thresholds for standing changes | CourseHistory, ProgramLevel | ⚠️ Partial — no business rules for standing thresholds |
| SAP (Satisfactory Academic Progress) compliance | CourseHistory, Program, FinancialAid* | ❌ Not modeled — CDM has no financial aid entities |

### Section 3: Course Enrollment

| Audit Check | CDM Entities Involved | CDM Coverage |
|------------|----------------------|--------------|
| Duplicate course registrations | CourseHistory, CourseSection | ⚠️ Partial — no uniqueness constraints defined |
| Capacity vs. actual enrollment | CourseSection | ❌ No capacity field in CDM |
| Prerequisite enforcement | Course, CourseHistory | ❌ No prerequisite relationships in CDM |

### Section 4: Grading

| Audit Check | CDM Entities Involved | CDM Coverage |
|------------|----------------------|--------------|
| Missing final grades for completed terms | CourseHistory, AcademicPeriod | ⚠️ Partial — CDM has grade fields but no completion rules |
| Grade changes after term close | CourseHistory | ❌ No audit trail / change tracking in CDM |
| Grade distribution anomalies | CourseHistory, CourseSection | ❌ No statistical validation layer |

### Section 5: Term & Catalog

| Audit Check | CDM Entities Involved | CDM Coverage |
|------------|----------------------|--------------|
| Orphaned courses (no active term) | Course, AcademicPeriod | ⚠️ Partial |
| Catalog version mismatches | ProgramVersion, ProgramVersionDetail | ✅ Modeled — CDM has explicit version tracking |
| Term date overlaps | AcademicPeriod | ⚠️ No overlap validation |

### Section 6: FERPA Compliance

| Audit Check | CDM Entities Involved | CDM Coverage |
|------------|----------------------|--------------|
| Directory hold flags | Contact | ❌ No FERPA fields in CDM |
| Consent records for information release | Contact | ❌ No consent tracking |
| Access log audit trails | (system-level) | ❌ Not in data model scope |

### Section 7: 1098-T Tax Compliance

| Audit Check | CDM Entities Involved | CDM Coverage |
|------------|----------------------|--------------|
| Qualified tuition and fees | (Billing*) | ❌ CDM has no billing/charges entities |
| Student SSN/TIN validation | Contact | ❌ No SSN/TIN fields in CDM |
| Box amounts reconciliation | (Billing*, FinancialAid*) | ❌ Not modeled |

### Section 8: Duplicate Accounts

| Audit Check | CDM Entities Involved | CDM Coverage |
|------------|----------------------|--------------|
| Duplicate student records (name + DOB) | Contact | ⚠️ Partial — Contact entity exists but no dedup logic |
| Merged account orphans | Contact, Account | ❌ No merge history tracking |
| Cross-system ID mismatches | Contact (externalSourceSystem) | ⚠️ CDM has external source field |

### Section 9: Security

| Audit Check | CDM Entities Involved | CDM Coverage |
|------------|----------------------|--------------|
| Inactive users with active permissions | (system-level) | ❌ Not in data model scope |
| Role-based access validation | (system-level) | ❌ Not in data model scope |
| Privileged account monitoring | (system-level) | ❌ Not in data model scope |

### Section 10: Credit Hours & Limits

| Audit Check | CDM Entities Involved | CDM Coverage |
|------------|----------------------|--------------|
| Credit hour mismatches (catalog vs. transcript) | Course, CourseHistory | ⚠️ Partial — both have credit fields |
| Overload approvals | CourseHistory | ❌ No overload workflow |
| Transfer credit articulation | PreviousEducation | ⚠️ Partial — entity exists but no articulation rules |

### Section 11: Withdrawals

| Audit Check | CDM Entities Involved | CDM Coverage |
|------------|----------------------|--------------|
| Withdrawal date vs. last attendance | CourseHistory, RegistrationStatus | ⚠️ Partial |
| Return of Title IV (R2T4) calculations | (FinancialAid*) | ❌ Not modeled |
| Unofficial withdrawal detection | CourseHistory | ❌ No attendance tracking in CDM |

### Section 12: Degrees & Graduation

| Audit Check | CDM Entities Involved | CDM Coverage |
|------------|----------------------|--------------|
| Degree requirements completion | Program, ProgramVersion, CourseHistory | ⚠️ Partial — entities exist but no requirements engine |
| Diploma name vs. program name | Program, Contact | ⚠️ Partial |
| Graduation date validation | StudentStatus, AcademicPeriod | ⚠️ Partial |

### Section 13: Referential Integrity

| Audit Check | CDM Entities Involved | CDM Coverage |
|------------|----------------------|--------------|
| Orphaned foreign keys | All entities | ❌ CDM defines relationships but not integrity checks |
| Missing required fields | All entities | ⚠️ CDM defines required fields at schema level |
| Cascade delete validation | All entities | ❌ Not defined |

### Section 14: Admissions Pipeline

| Audit Check | CDM Entities Involved | CDM Coverage |
|------------|----------------------|--------------|
| Application status progression | Contact, StudentStatus | ⚠️ Partial — no admissions-specific workflow |
| Duplicate applications | Contact | ⚠️ Partial |
| Conversion funnel integrity | Contact, StudentStatus | ❌ No funnel/pipeline entities |

### Section 15: IPEDS Readiness

| Audit Check | CDM Entities Involved | CDM Coverage |
|------------|----------------------|--------------|
| Race/ethnicity completeness | Contact | ⚠️ Partial — Contact exists but IPEDS-specific fields not defined |
| First-time, full-time cohort identification | AcademicPeriodDetail, CourseHistory | ⚠️ Partial — requires derived logic |
| Graduation rate cohort tracking | StudentStatus, AcademicPeriod | ⚠️ Partial |
| Completions by CIP code | Program, AreaOfStudy | ⚠️ Partial — no CIP code field in CDM |
| Financial aid recipient counts | (FinancialAid*) | ❌ Not modeled |

---

## What the CDM Doesn't Model (Audit Gaps)

The Microsoft Education Accelerator CDM is a **CRM-flavored student lifecycle model**. It covers the "happy path" of student engagement — enrollment, courses, grades, scholarships, internships, graduation. It does **not** model the operational and compliance infrastructure that auditors actually examine.

### Entities Missing from the CDM

| Domain | What's Missing | Audit Impact |
|--------|---------------|--------------|
| **Student Billing** | Charges, payments, refunds, payment plans, 1098-T | Cannot audit financial transactions or tax compliance |
| **Financial Aid** | Awards, disbursements, SAP calculations, R2T4, Pell, COD | Cannot audit Title IV compliance |
| **FERPA** | Consent records, directory holds, access logs | Cannot audit privacy compliance |
| **Attendance** | Daily/session attendance records | Cannot audit unofficial withdrawals or Clery Act |
| **Security/Audit Trail** | User access logs, permission history, change tracking | Cannot audit system security |
| **Admissions** | Applications, decisions, CRM pipeline, recruitment | Cannot audit admissions integrity |
| **Scheduling** | Room assignments, time slots, instructor loads | Cannot audit resource utilization |
| **Advising** | Degree audits, advising notes, holds | Cannot audit student success infrastructure |

### Compliance Domains Not Represented

| Compliance Area | What Would Be Needed | CDM Status |
|----------------|---------------------|------------|
| **Accreditation** (HLC, SACSCOC, MSCHE, etc.) | Program review dates, assessment outcomes, faculty credentials, student learning outcomes | ❌ Not modeled |
| **Office of Civil Rights / Title IX** | Disability accommodations, Title IX complaints, ADA compliance, Clery Act crime data | ❌ Not modeled |
| **State Audits** | Residency verification, state authorization, state financial aid, in-state/out-of-state classification | ❌ Not modeled |
| **Private Foundations** | Scholarship fund restrictions, donor compliance, endowment spending, restricted gift reconciliation | ❌ Not modeled |
| **Title IV (Federal Aid)** | R2T4 calculations, COD reporting, Pell recalculations, verification requirements, default rate monitoring | ❌ Not modeled |
| **Gainful Employment** | Debt-to-earnings ratios, program-level outcomes, disclosure requirements | ❌ Not modeled |
| **Clery Act** | Campus crime reporting, geography definitions, timely warning records | ❌ Not modeled |

---

## A Generic SIS Audit Schema

Based on the CDM reference, industry standards (PESC, SIF, Ed-Fi), and practical audit requirements, a comprehensive SIS audit framework needs entities across these domains:

### Tier 1: Core Academic (CDM covers ~70%)

- Terms / Academic Periods
- Courses / Sections / Catalog
- Enrollment / Registration
- Grades / Transcript
- Programs / Degrees / Requirements
- Student Status / Standing

### Tier 2: Operational (CDM covers ~10%)

- Student Billing & Charges
- Financial Aid & Disbursements
- Admissions & Recruitment
- Scheduling & Room Assignment
- Advising & Degree Audit
- Attendance & Participation

### Tier 3: Compliance (CDM covers 0%)

- FERPA Consent & Access Logs
- 1098-T Tax Reporting
- Title IV / SAP / R2T4
- IPEDS Reporting Dimensions
- Accreditation Review Cycles
- State Authorization & Reporting

### Tier 4: Infrastructure (CDM covers 0%)

- User Security & Permissions
- Audit Trail / Change History
- System Integration Logs
- Data Quality / Duplicate Detection
- Referential Integrity Monitoring
- Backup & Recovery Validation

---

## Implications for Audit Design

1. **The CDM is a starting point, not a finish line.** It establishes the vocabulary — Academic Period, Course, Program, Contact — but doesn't model the operational depth that auditors need. Any audit framework built only on CDM entities would miss billing, financial aid, security, and compliance entirely.

2. **Audit checks should be entity-aware but platform-agnostic.** The check "students with active enrollment but no course registrations" exists regardless of whether the underlying tables are called `StudentTermRecord`, `STUDENT_ENROLLMENT`, or `mshied_AcademicPeriodDetail`. The audit logic is the same; only the column names change.

3. **Compliance audits require entities the CDM never intended to model.** FERPA, Title IV, accreditation, and state compliance involve data elements that live outside the student lifecycle CRM model. These need their own audit sections with their own entity references.

4. **The 57-check baseline covers Tiers 1-2 well, with partial Tier 3.** Expanding to 80-100+ checks would add accreditation readiness, OCR/Title IX data completeness, state-specific validations, and foundation/advancement compliance.

---

## Other Industry Data Standards for Reference

| Standard | Organization | Scope | Notes |
|----------|-------------|-------|-------|
| [PESC](https://www.pesc.org/) | Postsecondary Electronic Standards Council | Transcript, enrollment, financial aid XML schemas | Industry standard for data exchange |
| [Ed-Fi](https://www.ed-fi.org/) | Ed-Fi Alliance | K-12 data model (some higher ed overlap) | Open-source, widely adopted |
| [SIF](https://www.a4l.org/) | Access 4 Learning | K-12/Higher Ed interoperability | Standards body for education data |
| [IMS Global / 1EdTech](https://www.1edtech.org/) | 1EdTech Consortium | LTI, Caliper, CLR, Open Badges | Learning tools & credentialing standards |
| [CEDS](https://ceds.ed.gov/) | US Dept of Education | Common Education Data Standards | Federal reporting alignment |
| [Microsoft CDM for Education](https://github.com/microsoft/Industry-Accelerator-Education) | Microsoft | Dataverse-based higher ed + K-12 schema | Open-source (MIT), archived 2024 |

---

## Summary

The Microsoft Education Accelerator CDM provides a useful **vendor-neutral vocabulary** for discussing higher education entities. By mapping audit checks against these entities rather than platform-specific table names, institutions can:

- **Evaluate audit coverage** independent of which SIS they run
- **Identify gaps** in their compliance monitoring
- **Communicate audit scope** to non-technical stakeholders using standard terminology
- **Plan migrations** by understanding which audit checks need to be re-mapped when changing platforms

The audit checks themselves are universal. The table names are implementation details.

---

*This document references the Microsoft Education Accelerator Common Data Model, available under MIT license at [github.com/microsoft/Industry-Accelerator-Education](https://github.com/microsoft/Industry-Accelerator-Education). Microsoft, Dynamics 365, and Dataverse are trademarks of Microsoft Corporation. This publication is not affiliated with or endorsed by Microsoft.*

*Document Version: 1.0*
*ERPize — The ERP Magazine | Independent Editorial*
