# MCSP-232: PROJECT SYNOPSIS
## Master of Computer Applications (MCA) — Final Year Project

---

**INDIRA GANDHI NATIONAL OPEN UNIVERSITY (IGNOU)**
**School of Computer and Information Sciences**

---

| Field | Details |
|---|---|
| **Project Title** | Construction Management System |
| **Course Code** | MCSP-232 |
| **Programme** | Master of Computer Applications (MCA) |
| **Student Name** | [Your Full Name] |
| **Enrollment Number** | [Your Enrollment Number] |
| **Study Centre Code** | [Your Study Centre Code] |
| **Regional Centre** | [Your Regional Centre] |
| **Submission Date** | June 2026 |
| **Supervisor Name** | [Supervisor's Name] |
| **Supervisor Designation** | [Designation, Institution] |

---

---

# SECTION 1: TITLE OF THE PROJECT

## **Construction Management System**

### Sub-title: A Web-Based Integrated Platform for End-to-End Construction Project Lifecycle Management

---

---

# SECTION 2: INTRODUCTION AND OBJECTIVES OF THE PROJECT

## 2.1 Background and Context

The construction industry is one of the oldest and most capital-intensive sectors of the global economy. According to the Global Construction 2030 report published by Oxford Economics and Global Construction Perspectives, the worldwide construction output is projected to grow to $15.5 trillion by 2030, accounting for approximately 13.5% of the global GDP. Despite this enormous scale, the construction industry remains one of the least digitized and operationally inefficient sectors in existence. Studies by McKinsey Global Institute have consistently found that large construction projects typically run 20% over schedule and up to 80% over budget. These staggering overruns are not attributable to a single root cause but rather to a systemic failure of information flow, resource coordination, financial oversight, and real-time decision-making.

In the Indian context, the construction sector is the second-largest employer after agriculture, directly employing over 51 million people and contributing approximately 9% to India's GDP. Yet, the industry continues to be dominated by paper-based workflows, fragmented communication channels, manual labour tracking, and siloed departmental systems. Construction project managers routinely juggle hundreds of tasks — from procurement to payroll, from compliance documentation to quality audits — using spreadsheets, physical registers, and informal verbal communication. This fragmentation creates critical blind spots: a project manager in a headquarters office has no real-time visibility into material consumption on a site 200 kilometres away; a procurement officer cannot instantly determine whether a new purchase order will breach the approved budget; a client has no transparent view of the milestones achieved against the contract value paid.

The **Construction Management System (CMS)** proposed in this synopsis is a comprehensive, web-based software application designed to bridge these operational gaps. It is conceived as a single, unified digital platform that integrates all primary functions of a construction enterprise — project planning, task assignment, workforce management, material procurement and inventory, financial budgeting and cost control, document management, quality and safety inspection, client communication, and multi-level reporting — into one cohesive, role-aware, and data-driven system.

## 2.2 Problem Statement

The following critical problems have been identified through a study of current construction industry practices in small-to-medium construction firms and government infrastructure agencies:

**Problem 1 — Lack of Centralized Information Repository:** Construction projects generate enormous volumes of data — blueprints, BOQs (Bills of Quantities), purchase orders, inspection reports, daily progress reports, labour muster rolls, and financial vouchers. In the absence of a central digital repository, these documents are stored in disparate physical files, individual email inboxes, and personal hard drives. Retrieval is time-consuming and version control is virtually non-existent.

**Problem 2 — Inadequate Real-Time Progress Monitoring:** Site supervisors maintain physical daily progress reports (DPRs) that are submitted to the head office days or weeks after the actual work occurs. By the time information reaches decision-makers, the opportunity to course-correct has already been lost. There is no mechanism for real-time milestone tracking or earned value analysis.

**Problem 3 — Manual and Error-Prone Financial Tracking:** Project budgets are typically maintained in Excel spreadsheets, with actual expenditure tracked separately in accounting software. The reconciliation of planned vs. actual costs is a manual, periodic exercise that is prone to errors, omissions, and deliberate manipulation. Cost overruns are often discovered only after they have become irreversible.

**Problem 4 — Inefficient Labour and Equipment Management:** Construction projects involve large, fluid workforces of skilled and unskilled labourers, often sourced from contractors and sub-contractors. Attendance marking, skill categorization, wage calculation, and productivity measurement are done manually, leading to payroll fraud (ghost workers), productivity losses, and compliance violations under the Contract Labour (Regulation and Abolition) Act, 1970.

**Problem 5 — Absence of Structured Procurement and Inventory Control:** Material procurement is one of the largest cost heads in any construction project, often accounting for 50-60% of total project cost. Without a structured procurement system linked to a real-time inventory, sites frequently experience both material shortages (causing work stoppages) and material surpluses (leading to wastage and theft). Vendor management is informal and price benchmarking is absent.

**Problem 6 — Communication Gaps Between Stakeholders:** A typical construction project involves owners/clients, architects, structural engineers, project managers, site engineers, contractors, sub-contractors, vendors, and government inspectors. Without a structured communication platform, critical instructions are lost in translation, design changes are not propagated to the right people, and dispute resolution becomes contentious due to the absence of documented trails.

**Problem 7 — Inadequate Safety and Quality Management:** Safety incidents on construction sites are tragically common in India. The absence of a digital system for recording near-miss incidents, tracking safety audits, issuing non-conformance reports, and monitoring corrective actions leads to a reactive (rather than preventive) safety culture.

## 2.3 Motivation for Digitization

The rapid proliferation of affordable smartphones, widespread 4G/5G connectivity, cloud computing infrastructure (AWS, Google Cloud, Microsoft Azure), and government initiatives like Digital India have created a fertile environment for deploying web-based construction management solutions even in remote site locations. Open-source technologies such as Node.js, React.js, PostgreSQL, and Docker have dramatically reduced the development cost of enterprise-grade software, making it feasible for MCA-level projects to propose and prototype sophisticated, production-ready systems.

The COVID-19 pandemic further underscored the need for digital workflows that can function without physical co-location, as lockdowns and restrictions made it impossible for site staff to physically submit reports to head offices.

## 2.4 Detailed Objectives of the Project

The Construction Management System (CMS) is designed to achieve the following detailed, specific, and measurable objectives:

### 2.4.1 Primary Objectives

- **Objective 1 — Unified Project Lifecycle Management:** To design and implement a system capable of managing a construction project from inception (client onboarding, contract signing) through planning (WBS, scheduling, resource allocation), execution (daily progress, labour tracking, material consumption), monitoring (milestone review, budget variance), and closure (final billing, handover documentation), providing a single source of truth for all project stakeholders.

- **Objective 2 — Real-Time Progress Tracking and Reporting:** To enable site engineers and supervisors to submit Digital Daily Progress Reports (DPRs) through the web interface, which are instantly aggregated and made available to project managers and clients through interactive dashboards, eliminating the lag inherent in paper-based reporting.

- **Objective 3 — Automated Budget Management and Cost Control:** To implement a budget module that links the approved BOQ with actual expenditure records, providing real-time cost variance analysis, earned value metrics (CPI, SPI), and automated alerts when expenditure approaches defined threshold percentages of the approved budget.

- **Objective 4 — Digital Labour Management and Payroll Processing:** To create a module for registering workers with their skill categories, tracking daily attendance through the site supervisor's interface, calculating wages based on attendance and applicable rates, and generating compliant payroll registers (Form XIII under CL(R&A) Act).

- **Objective 5 — Integrated Material Procurement and Inventory Management:** To implement a procurement cycle from indenting (material requisition) through vendor quotation, purchase order generation, goods receipt note (GRN) recording, and inventory consumption tracking, with reorder level alerts to prevent stock-outs.

- **Objective 6 — Multi-Stakeholder Role-Based Access Control:** To design a role-based access control system with distinct permission profiles for Admin, Client, Project Manager, Site Engineer, Supervisor, Accounts Manager, and Store Keeper, ensuring that each user can access only the data and functions relevant to their role.

- **Objective 7 — Document and Drawing Management:** To provide a centralized, version-controlled document repository for storing and retrieving architectural drawings, structural drawings, specifications, contracts, insurance certificates, and permits, with full audit trails of access and modification.

- **Objective 8 — Safety and Quality Management:** To implement digital checklists for safety audits and quality inspections at key construction milestones (foundation, superstructure, plumbing, electrical, finishing), with non-conformance reporting (NCR) and corrective action tracking.

- **Objective 9 — Client Portal and Transparent Communication:** To provide clients with a dedicated login portal where they can view project progress photographs, approved milestone achievements, payment schedules, and download reports, building trust and reducing disputes through transparency.

- **Objective 10 — Comprehensive Analytics and Reporting:** To generate a suite of management reports including Project Progress Reports, Budget Variance Reports, Labour Productivity Reports, Material Utilization Reports, Vendor Performance Reports, and Safety Incident Summaries, exportable in PDF and Excel formats.

### 2.4.2 Secondary Objectives

- To apply modern software engineering principles (Agile/Scrum methodology, MVC architecture, RESTful API design) in the development of the system.
- To ensure the system is responsive and accessible on both desktop browsers and mobile devices, enabling site-level data entry without specialized hardware.
- To design the database in Third Normal Form (3NF) to eliminate redundancy and ensure data integrity across all modules.
- To implement industry-standard security mechanisms including JWT-based authentication, bcrypt password hashing, HTTPS enforcement, and protection against OWASP Top 10 vulnerabilities.
- To architect the system for horizontal scalability, capable of supporting multiple concurrent projects and hundreds of simultaneous users without performance degradation.

---

---

# SECTION 3: PROJECT CATEGORY

## **Category: Information Management System / Web-Based Application**

As per IGNOU MCSP-232 approved project categories, this project falls under the category of **"Information Management System"** implemented as a **"Web-Based Application"**.

**Justification:** The Construction Management System is fundamentally an information management system — it captures, stores, processes, retrieves, and disseminates information related to construction project activities across multiple organizational roles. The web-based implementation ensures platform independence, centralized data management, and multi-user concurrent access without requiring specialized client-side software installation.

**Additional Classification Tags:**
- Enterprise Resource Planning (ERP) for the Construction Domain
- Multi-Tier Client-Server Architecture
- Role-Based Multi-User System
- Cloud-Ready SaaS-Model Application

---

---

# SECTION 4: TOOLS/PLATFORM, HARDWARE, AND SOFTWARE REQUIREMENT SPECIFICATIONS

## 4.1 Hardware Requirements

### 4.1.1 Server-Side Hardware Requirements (Production Environment)

| Component | Minimum Specification | Recommended Specification | Purpose |
|---|---|---|---|
| **Processor** | Intel Xeon E5-2600 v4, 8 Cores, 2.2 GHz | Intel Xeon Gold 6230, 20 Cores, 2.1 GHz | Application server processing |
| **RAM** | 16 GB DDR4 ECC | 64 GB DDR4 ECC | Node.js runtime, database buffer pool |
| **Primary Storage** | 500 GB SSD (NVMe) | 2 TB NVMe SSD RAID-10 | OS, application binaries, logs |
| **Database Storage** | 1 TB SSD | 4 TB SSD RAID-10 | PostgreSQL data files, WAL logs |
| **Document Storage** | 2 TB HDD | 10 TB HDD RAID-5 / Object Store | Drawings, photographs, PDF documents |
| **Network Interface** | 1 Gbps Ethernet | 10 Gbps Ethernet (bonded) | High-throughput data transfer |
| **Backup Device** | External 4 TB HDD | NAS with 16 TB, RAID-6 | Automated daily backups |
| **Power Supply** | UPS 2 KVA | Redundant PSU + UPS 10 KVA | Power continuity |
| **GPU** (Optional) | N/A | NVIDIA T4 (for future AI features) | Future ML-based analytics |

### 4.1.2 Client-Side Hardware Requirements (End-User Devices)

| Device Type | Minimum Specification | Recommended Specification | Target Users |
|---|---|---|---|
| **Desktop/Laptop** | Intel Core i3, 4 GB RAM, 1280x720 display | Intel Core i5, 8 GB RAM, 1920x1080 display | Admin, Project Manager, Accounts |
| **Tablet (Android/iOS)** | 2 GB RAM, 7-inch screen, 4G connectivity | 4 GB RAM, 10-inch screen, Wi-Fi 6 | Site Engineer, Supervisor |
| **Smartphone** | Android 9.0+, 2 GB RAM, 4G | Android 12+, 4 GB RAM, 5G | Site Supervisor (DPR, Attendance) |
| **Network** | Minimum 4 Mbps broadband | 25 Mbps broadband / 4G LTE | Any location with connectivity |

### 4.1.3 Development Environment Hardware

| Component | Specification |
|---|---|
| **Development Machine** | Intel Core i7-10th Gen, 16 GB RAM, 512 GB SSD |
| **Operating System** | Windows 11 Pro / Ubuntu 22.04 LTS |
| **Second Monitor** | 24-inch Full HD (for dual-screen development) |
| **Version Control Server** | GitHub (cloud-hosted) |

---

## 4.2 Software Requirements

### 4.2.1 Operating System

| Layer | Software | Version | License | Purpose |
|---|---|---|---|---|
| **Server OS** | Ubuntu Server | 22.04 LTS | Open Source (GPL) | Production server OS |
| **Development OS** | Windows 11 Pro / Ubuntu 22.04 | Latest | Commercial / Open Source | Development workstation |
| **Containerization OS** | Alpine Linux (Docker base) | 3.18 | Open Source (MIT) | Lightweight container OS |

### 4.2.2 Frontend Technologies

| Technology | Version | Purpose |
|---|---|---|
| **React.js** | 18.2.x | Component-based UI framework |
| **Vite** | 5.x | Frontend build tool and dev server |
| **Tailwind CSS** | 3.4.x | Utility-first CSS framework for responsive design |
| **React Router DOM** | 6.x | Client-side routing and navigation |
| **Axios** | 1.6.x | HTTP client for REST API communication |
| **React Query (TanStack)** | 5.x | Server state management, caching, background sync |
| **Recharts** | 2.x | Charting library for dashboards and analytics |
| **React Hook Form** | 7.x | Performant form management with validation |
| **Zod** | 3.x | Schema validation for form inputs |
| **Lucide React** | Latest | Icon library |
| **date-fns** | 3.x | Date manipulation and formatting |
| **jsPDF + AutoTable** | 2.x | Client-side PDF generation for reports |
| **xlsx (SheetJS)** | 0.18.x | Excel export functionality |

### 4.2.3 Backend Technologies

| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | 20.x LTS | Server-side JavaScript runtime |
| **Express.js** | 4.x | Web application framework for REST APIs |
| **Prisma ORM** | 5.x | Type-safe database ORM with migration support |
| **JSON Web Token (jsonwebtoken)** | 9.x | Stateless authentication token generation and verification |
| **bcryptjs** | 2.4.x | Password hashing (10+ rounds) |
| **Multer** | 1.4.x | Multipart form data handling for file uploads |
| **Sharp** | 0.33.x | Image compression and resizing for uploaded photos |
| **Nodemailer** | 6.x | Email notification service |
| **helmet** | 7.x | HTTP security headers middleware |
| **express-rate-limit** | 7.x | API rate limiting to prevent brute-force attacks |
| **cors** | 2.x | Cross-Origin Resource Sharing configuration |
| **winston** | 3.x | Structured application logging |
| **joi** | 17.x | Server-side input validation |
| **dotenv** | 16.x | Environment variable management |
| **compression** | 1.x | Gzip response compression |
| **morgan** | 1.x | HTTP request logging middleware |

### 4.2.4 Database

| Technology | Version | Purpose |
|---|---|---|
| **PostgreSQL** | 15.x | Primary relational database (ACID-compliant) |
| **Redis** | 7.x | Session caching, rate limit counters, notification queues |
| **Prisma Migrate** | 5.x | Database schema versioning and migrations |

### 4.2.5 DevOps and Deployment Tools

| Tool | Version | Purpose |
|---|---|---|
| **Docker** | 24.x | Application containerization |
| **Docker Compose** | 2.x | Multi-container orchestration (dev/staging) |
| **Nginx** | 1.24.x | Reverse proxy, SSL termination, static file serving |
| **PM2** | 5.x | Node.js process manager (clustering, restart on crash) |
| **GitHub Actions** | N/A | CI/CD pipeline automation |
| **Let's Encrypt (Certbot)** | Latest | Free SSL/TLS certificate provisioning |

### 4.2.6 Development Tools and IDEs

| Tool | Version | Purpose |
|---|---|---|
| **Visual Studio Code** | Latest | Primary IDE for frontend and backend development |
| **Postman** | Latest | REST API testing and documentation |
| **DBeaver** | Latest | PostgreSQL database GUI client |
| **Git** | 2.x | Version control system |
| **GitHub** | N/A | Remote repository hosting, pull request management |
| **ESLint + Prettier** | Latest | Code linting and formatting |
| **Jest** | 29.x | Unit testing framework (backend) |
| **React Testing Library** | 14.x | Component testing (frontend) |
| **draw.io / Lucidchart** | Latest | UML and architecture diagram creation |
| **Figma** | Latest | UI/UX wireframing and prototype design |

### 4.2.7 Third-Party Services and APIs

| Service | Purpose |
|---|---|
| **SendGrid / SMTP** | Email notifications for milestone alerts, approvals |
| **Cloudinary (Optional)** | Cloud-based image storage for site photographs |
| **Google Maps API (Optional)** | Geolocation tagging for project sites |
| **Twilio (Optional)** | SMS alerts for critical events (budget breach, safety incident) |

---

---

# SECTION 5: PROBLEM DEFINITION & PLANNING

## 5.1 Functional Requirement Specifications (FRS)

The functional requirements define the specific behaviors and functions the system must support. They are organized by module.

### 5.1.1 User Management and Authentication Module

| Req. ID | Requirement | Priority |
|---|---|---|
| FR-UM-01 | The system shall allow an Administrator to create, edit, deactivate, and delete user accounts. | HIGH |
| FR-UM-02 | Each user account shall be assigned exactly one of the following roles: Admin, Project Manager, Site Engineer, Supervisor, Accounts Manager, Store Keeper, Client. | HIGH |
| FR-UM-03 | The system shall authenticate users via email address and password. | HIGH |
| FR-UM-04 | Upon successful authentication, the system shall issue a signed JSON Web Token (JWT) with a configurable expiry time (default: 8 hours). | HIGH |
| FR-UM-05 | The system shall enforce password complexity: minimum 8 characters, at least one uppercase letter, one digit, and one special character. | HIGH |
| FR-UM-06 | The system shall provide a "Forgot Password" feature that sends a time-limited (15-minute) password reset link to the registered email. | MEDIUM |
| FR-UM-07 | All failed login attempts shall be logged with timestamp and IP address. After 5 consecutive failures, the account shall be temporarily locked for 30 minutes. | HIGH |
| FR-UM-08 | The system shall maintain a complete audit log of all user actions (login, logout, record creation, modification, deletion). | HIGH |
| FR-UM-09 | Administrators shall be able to assign users to specific projects, restricting their data visibility to only their assigned projects. | HIGH |

### 5.1.2 Project Management Module

| Req. ID | Requirement | Priority |
|---|---|---|
| FR-PM-01 | The system shall allow authorized users (Admin, Project Manager) to create new projects with fields: project name, project code, client, location, contract value, start date, planned end date, project type (residential, commercial, infrastructure, industrial). | HIGH |
| FR-PM-02 | The system shall support the creation of a Work Breakdown Structure (WBS) for each project, with unlimited hierarchical levels (Phase > Activity > Task). | HIGH |
| FR-PM-03 | Each WBS task shall have: name, description, planned start date, planned end date, assigned personnel, planned cost, predecessor tasks (for scheduling dependencies). | HIGH |
| FR-PM-04 | The system shall display a Gantt chart view of the project schedule, rendered in the browser, showing planned vs. actual progress bars for each task. | HIGH |
| FR-PM-05 | The system shall calculate and display project completion percentage based on completed task weights. | HIGH |
| FR-PM-06 | The system shall send automated email notifications to the Project Manager when a task deadline is within 3 days and the task is not yet marked complete. | MEDIUM |
| FR-PM-07 | The system shall support project status transitions: Initiated → Planning → Active → On Hold → Completed → Closed. | HIGH |
| FR-PM-08 | The system shall allow multiple projects to be managed simultaneously, with the dashboard showing an aggregated portfolio view. | MEDIUM |

### 5.1.3 Budget and Financial Management Module

| Req. ID | Requirement | Priority |
|---|---|---|
| FR-BF-01 | The system shall allow creation of a detailed Bill of Quantities (BOQ) for each project, with line items specifying: item code, description, unit of measure, estimated quantity, unit rate, and total estimated cost. | HIGH |
| FR-BF-02 | The system shall aggregate all BOQ items to produce the Approved Project Budget, broken down by cost category (Civil Work, Structural Work, MEP, Finishing, Contingency). | HIGH |
| FR-BF-03 | The system shall record all financial transactions (payments to vendors, contractor bills, petty cash) against specific BOQ line items or cost categories. | HIGH |
| FR-BF-04 | The system shall display real-time budget utilization: Approved Budget, Committed Cost, Actual Expenditure, and Budget Variance for each category and at the overall project level. | HIGH |
| FR-BF-05 | The system shall generate automated alerts (email + dashboard notification) when actual expenditure reaches 80%, 90%, and 100% of the approved budget for any category. | HIGH |
| FR-BF-06 | The system shall calculate Earned Value Management (EVM) metrics: Planned Value (PV), Earned Value (EV), Actual Cost (AC), Schedule Variance (SV), Cost Variance (CV), Schedule Performance Index (SPI), and Cost Performance Index (CPI). | MEDIUM |
| FR-BF-07 | The system shall support raising, approving, and tracking Variation Orders (change orders) that modify the original contract scope and budget. | MEDIUM |
| FR-BF-08 | The system shall generate contractor payment certificates based on the certified percentage of work completed, with approval workflows. | HIGH |

### 5.1.4 Labour Management Module

| Req. ID | Requirement | Priority |
|---|---|---|
| FR-LM-01 | The system shall maintain a master register of all workers (permanent, contract, skilled, unskilled) with fields: name, ID proof type and number, trade/skill category, contractor affiliation, date of joining. | HIGH |
| FR-LM-02 | Site supervisors shall be able to mark daily attendance for workers through a mobile-friendly interface, recording: present/absent/half-day status, overtime hours, and site location. | HIGH |
| FR-LM-03 | The system shall maintain a configurable wage rate card defining daily wages for each trade/skill category. | HIGH |
| FR-LM-04 | The system shall automatically calculate weekly and monthly payroll based on attendance records and applicable wage rates, with overtime calculated at 2x the standard rate. | HIGH |
| FR-LM-05 | The system shall generate Form XIII (Muster Roll) and payroll registers compliant with the Contract Labour (Regulation and Abolition) Act, 1970. | MEDIUM |
| FR-LM-06 | The system shall track worker certifications (safety training, trade certification) and alert supervisors when certifications are due for renewal. | MEDIUM |

### 5.1.5 Material and Inventory Management Module

| Req. ID | Requirement | Priority |
|---|---|---|
| FR-MI-01 | The system shall maintain a Material Master containing all standard construction materials with: material code, description, unit of measure, HSN code, and current market rate. | HIGH |
| FR-MI-02 | Site Store Keepers shall be able to raise Material Requisition Notes (MRN) specifying material, quantity required, and required date. | HIGH |
| FR-MI-03 | Approved MRNs shall trigger a procurement workflow: vendor selection, Request for Quotation (RFQ), quotation comparison, Purchase Order (PO) generation with approval. | HIGH |
| FR-MI-04 | Upon material delivery, the Store Keeper shall record a Goods Receipt Note (GRN) capturing: supplier, invoice number, items received, quantity, condition, and storage location. | HIGH |
| FR-MI-05 | The system shall maintain real-time stock levels for each material at each project site, updated automatically when GRNs are recorded and materials are issued. | HIGH |
| FR-MI-06 | The system shall trigger reorder alerts when stock falls below the predefined Reorder Level for any material. | HIGH |
| FR-MI-07 | The system shall maintain a vendor master with vendor details, past performance ratings, and blacklisting capability. | MEDIUM |
| FR-MI-08 | The system shall generate material consumption reports by cost center, comparing budgeted vs. actual material usage. | MEDIUM |

### 5.1.6 Daily Progress Report (DPR) Module

| Req. ID | Requirement | Priority |
|---|---|---|
| FR-DP-01 | Site Engineers shall submit a Digital DPR daily for each active project, capturing: date, weather conditions, activities performed, quantities completed, manpower deployed (by trade), equipment deployed, materials consumed, and remarks. | HIGH |
| FR-DP-02 | Each DPR entry shall allow attachment of up to 10 site photographs. | MEDIUM |
| FR-DP-03 | Submitted DPRs shall be reviewed and approved/rejected by the Project Manager. | HIGH |
| FR-DP-04 | The system shall aggregate DPR data to automatically update task completion percentages in the project schedule. | HIGH |
| FR-DP-05 | The system shall generate weekly and monthly progress summary reports from aggregated DPR data. | HIGH |

### 5.1.7 Document Management Module

| Req. ID | Requirement | Priority |
|---|---|---|
| FR-DM-01 | The system shall provide a hierarchical folder structure for each project to store documents categorized as: Drawings, Specifications, Contracts, Permits, Insurance, Correspondence, Reports. | HIGH |
| FR-DM-02 | The system shall support version control for all documents, maintaining a full history of revisions with timestamps and uploading user information. | HIGH |
| FR-DM-03 | Each document shall support metadata tagging: document number, revision number, discipline (architectural, structural, MEP), status (draft, under review, approved, superseded). | MEDIUM |
| FR-DM-04 | The system shall generate automated notifications to relevant users when a document status changes (e.g., from "under review" to "approved"). | MEDIUM |
| FR-DM-05 | The system shall enforce file type restrictions (PDF, DWG, JPG, PNG, XLSX, DOCX) and a maximum file size of 50 MB per document. | HIGH |

### 5.1.8 Safety and Quality Management Module

| Req. ID | Requirement | Priority |
|---|---|---|
| FR-SQ-01 | The system shall provide digital safety inspection checklists based on construction stage and applicable safety standards (IS 7969, IS 3696). | HIGH |
| FR-SQ-02 | Safety inspections shall be recorded with inspector name, date, checklist completion status, non-conformances identified, and corrective actions required. | HIGH |
| FR-SQ-03 | Safety incidents (near-miss, minor injury, major injury, fatality) shall be recorded with full details: date, time, location, personnel involved, description, and immediate action taken. | HIGH |
| FR-SQ-04 | Quality inspection checklists shall be available for each major construction milestone (concrete pour, brickwork, plastering, waterproofing, electrical wiring, plumbing, finishing). | HIGH |
| FR-SQ-05 | Non-Conformance Reports (NCRs) shall be raised for quality failures, with mandatory corrective action plans, responsible personnel assignment, and closure verification. | HIGH |

### 5.1.9 Client Portal Module

| Req. ID | Requirement | Priority |
|---|---|---|
| FR-CP-01 | Clients shall have read-only access to their project's progress summary, milestone status, and approved DPRs. | HIGH |
| FR-CP-02 | The client portal shall display the financial summary: contract value, billed amount, received amount, and retention. | HIGH |
| FR-CP-03 | Clients shall be able to view and download approved quality test reports and inspection certificates. | MEDIUM |
| FR-CP-04 | The client portal shall support a messaging/issue-raising feature for clients to formally log queries and concerns, with response tracking. | MEDIUM |

---

## 5.2 Non-Functional Requirement Specifications (NFRS)

| NFR ID | Category | Requirement |
|---|---|---|
| NFR-01 | **Performance** | API response time for standard data queries (project dashboard) shall be < 2 seconds under a load of 100 concurrent users. |
| NFR-02 | **Performance** | File uploads (< 10 MB) shall complete within 5 seconds on a 10 Mbps connection. |
| NFR-03 | **Scalability** | The system architecture shall support horizontal scaling by adding additional application server instances behind the load balancer without requiring application code changes. |
| NFR-04 | **Availability** | The system shall target 99.5% uptime (< 44 hours downtime per year) for the web application. |
| NFR-05 | **Security** | All data transmission shall be encrypted using TLS 1.3. |
| NFR-06 | **Security** | Passwords shall be stored as bcrypt hashes with a minimum cost factor of 10. No plaintext passwords shall ever be stored or logged. |
| NFR-07 | **Usability** | The web interface shall be responsive and fully functional on screen widths from 375px (mobile) to 2560px (4K desktop). |
| NFR-08 | **Usability** | Critical user workflows (DPR submission, attendance marking) shall be completable in < 5 minutes by a trained user. |
| NFR-09 | **Maintainability** | The codebase shall achieve a minimum of 70% unit test coverage for all business logic modules. |
| NFR-10 | **Reliability** | The system shall implement automated daily database backups with a 30-day retention policy. |
| NFR-11 | **Portability** | The application shall be containerized using Docker, enabling deployment on any Linux-based cloud provider (AWS, GCP, Azure, DigitalOcean). |
| NFR-12 | **Compliance** | The system shall implement audit logging for all Create, Update, and Delete operations, retaining logs for a minimum of 2 years. |
| NFR-13 | **Localization** | The system shall support Indian date formats (DD/MM/YYYY) and Indian Rupee (INR ₹) as the default currency. |

---

## 5.3 Literature Review

### 5.3.1 Review of Existing Systems

#### 5.3.1.1 Procore Technologies
Procore is a leading US-based cloud construction management platform used globally by large construction enterprises. It offers comprehensive modules for project management, financials, quality and safety, and field productivity. However, it is priced at $375–$1,500+ per month, making it completely inaccessible to small and medium construction firms in India. Additionally, Procore is not tailored to Indian compliance requirements (GST billing, Indian labour laws, CPWD standards).

#### 5.3.1.2 Autodesk Construction Cloud (ACC)
Formerly known as PlanGrid and BIM 360, Autodesk Construction Cloud is a powerful platform with deep BIM (Building Information Modelling) integration. Its primary strength is 3D model viewing and coordination, but its financial management and Indian compliance features are minimal. The licensing cost and the steep learning curve make it unsuitable for general adoption.

#### 5.3.1.3 Buildertrend
Buildertrend is a US-focused residential construction management software with good scheduling and client communication features. It lacks robust financial management for the Indian context (no GST support, no Indian format payroll), and its pricing ($399/month) is prohibitive for Indian SMEs.

#### 5.3.1.4 Traditional Tools (Spreadsheets and Paper)
The majority of Indian construction firms with annual turnover below ₹100 crore still rely on Microsoft Excel for budget tracking, physical muster rolls for labour attendance, and WhatsApp groups for site communication. These approaches have severe limitations in terms of data integrity, concurrent access, version control, audit trails, and analytical capability.

### 5.3.2 Comparison: Existing System vs. Proposed System

| Feature / Criterion | Procore | Buildertrend | Excel + Paper | **Proposed CMS** |
|---|---|---|---|---|
| **Cost** | $375–$1,500/month | $399/month | Free (but high hidden costs) | **Low (open-source stack)** |
| **Indian GST Compliance** | No | No | Manual | **Yes (built-in)** |
| **Indian Labour Law Compliance** | No | No | Manual | **Yes (Form XIII)** |
| **Multi-Project Management** | Yes | Limited | Manual | **Yes** |
| **Real-Time DPR** | Yes | Limited | No | **Yes** |
| **Role-Based Access Control** | Yes | Limited | No | **Yes (7 roles)** |
| **BOQ & Earned Value** | Yes | No | Manual | **Yes** |
| **Offline Capability** | Partial | Partial | Yes | **Partial (PWA roadmap)** |
| **Open Source / Customizable** | No | No | Yes | **Yes** |
| **Safety NCR Tracking** | Yes | No | No | **Yes** |
| **Client Portal** | Yes | Yes | No | **Yes** |
| **Document Version Control** | Yes | Partial | No | **Yes** |
| **API Integration** | Yes | Limited | No | **Yes (REST API)** |
| **Mobile Responsive** | Yes | Yes | No | **Yes** |
| **Deployment Flexibility** | Cloud Only | Cloud Only | Local | **Cloud + On-Premise** |
| **BIM Integration** | No | No | No | Roadmap |

---

## 5.4 Project Planning and Scheduling

### 5.4.1 Software Development Life Cycle (SDLC) Methodology

This project will follow an **Agile-Scrum** methodology with 2-week sprints organized within 5 major phases of development. The Agile approach is appropriate because:
- The system is large and complex, benefiting from iterative delivery of working modules.
- Requirements can be refined progressively as the architecture becomes clearer.
- The sprint review cycles allow for early detection and correction of design issues.

### 5.4.2 Project Phases and Task Breakdown

| Phase | Phase Name | Key Tasks | Duration (Weeks) |
|---|---|---|---|
| **Phase 1** | Requirements & Analysis | Stakeholder interviews, SRS documentation, use-case finalization, ER diagram, technology selection | 3 Weeks |
| **Phase 2** | System Design | Database schema design (3NF), API contract design, UI/UX wireframes (Figma), architecture diagram, DFD/UML diagrams | 3 Weeks |
| **Phase 3** | Implementation – Backend | Database setup, authentication module, project module API, labour module API, procurement module API, DPR module API, document management API, safety/quality module API | 10 Weeks |
| **Phase 4** | Implementation – Frontend | React project setup, authentication UI, project dashboard, WBS/Gantt component, budget module UI, labour tracking UI, procurement UI, DPR submission UI, document management UI, client portal UI, admin panel, reporting module | 10 Weeks |
| **Phase 5** | Testing & Deployment | Unit testing (Jest), integration testing (Postman), UAT with sample data, security audit, performance testing, Docker deployment, production config, documentation | 4 Weeks |
| **Total** | | | **30 Weeks** |

### 5.4.3 Gantt Chart — Textual Representation

The following table represents the Gantt Chart for the CMS project over a 30-week timeline. Each row is a task; columns represent 2-week sprint blocks. A filled cell (█) indicates active work in that period.

| Task ID | Task Name | S1-2 | S3-4 | S5-6 | S7-8 | S9-10 | S11-12 | S13-14 | S15-16 | S17-18 | S19-20 | S21-22 | S23-24 | S25-26 | S27-28 | S29-30 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| T01 | Stakeholder Requirements Gathering | █ | █ | | | | | | | | | | | | | |
| T02 | SRS Documentation | | █ | █ | | | | | | | | | | | | |
| T03 | Database Schema Design | | | █ | █ | | | | | | | | | | | |
| T04 | API Contract Design (OpenAPI) | | | █ | █ | | | | | | | | | | | |
| T05 | UI/UX Wireframing (Figma) | | | █ | █ | | | | | | | | | | | |
| T06 | UML / DFD Diagrams | | | | █ | █ | | | | | | | | | | |
| T07 | Backend: Auth + User Module | | | | | █ | █ | | | | | | | | | |
| T08 | Backend: Project Module | | | | | | █ | █ | | | | | | | | |
| T09 | Backend: Budget + BOQ Module | | | | | | | █ | █ | | | | | | | |
| T10 | Backend: Labour Module | | | | | | | | █ | █ | | | | | | |
| T11 | Backend: Procurement Module | | | | | | | | █ | █ | | | | | | |
| T12 | Backend: DPR Module | | | | | | | | | █ | █ | | | | | |
| T13 | Backend: Document + Safety Module | | | | | | | | | | █ | █ | | | | |
| T14 | Frontend: Auth + Dashboard | | | | | | █ | █ | | | | | | | | |
| T15 | Frontend: Project + WBS + Gantt UI | | | | | | | █ | █ | | | | | | | |
| T16 | Frontend: Budget + Financial UI | | | | | | | | █ | █ | | | | | | |
| T17 | Frontend: Labour + Attendance UI | | | | | | | | | █ | █ | | | | | |
| T18 | Frontend: Procurement + Inventory UI | | | | | | | | | | █ | █ | | | | |
| T19 | Frontend: DPR + Document Mgmt UI | | | | | | | | | | | █ | █ | | | |
| T20 | Frontend: Safety + Client Portal UI | | | | | | | | | | | | █ | █ | | |
| T21 | Frontend: Reporting + Admin Panel | | | | | | | | | | | | | █ | █ | |
| T22 | Integration Testing | | | | | | | | | | | | | | █ | █ |
| T23 | UAT + Bug Fixes | | | | | | | | | | | | | | | █ |
| T24 | Deployment + Documentation | | | | | | | | | | | | | | | █ |

**Critical Path:** T01 → T02 → T03 → T04 → T07 → T08 → T09 → T16 → T22 → T24
**Estimated Total Duration:** 30 Weeks (approximately 7.5 months)

### 5.4.4 PERT Chart — Task Network Analysis

The Program Evaluation and Review Technique (PERT) chart represents tasks as nodes and dependencies as directed edges. The three-point time estimates are: **Optimistic (O)**, **Most Likely (M)**, and **Pessimistic (P)**. The **Expected Time (Te)** is calculated as: **Te = (O + 4M + P) / 6**

| Task ID | Task Name | Predecessor(s) | O (wks) | M (wks) | P (wks) | Te (wks) | Slack |
|---|---|---|---|---|---|---|---|
| T01 | Requirements Gathering | None | 1.5 | 2 | 3 | 2.08 | 0 |
| T02 | SRS Documentation | T01 | 1 | 1.5 | 2.5 | 1.58 | 0 |
| T03 | Database Schema Design | T02 | 1 | 2 | 3 | 2.0 | 0 |
| T04 | API Contract Design | T02 | 1 | 1.5 | 2 | 1.5 | 1.0 |
| T05 | UI/UX Wireframing | T02 | 1.5 | 2 | 3.5 | 2.17 | 1.0 |
| T06 | UML/DFD Diagrams | T03, T04 | 1 | 2 | 3 | 2.0 | 0 |
| T07 | Backend: Auth Module | T06 | 1 | 2 | 3 | 2.0 | 0 |
| T08 | Backend: Project Module | T07 | 1.5 | 2 | 3 | 2.08 | 0 |
| T09 | Backend: Budget Module | T08 | 1.5 | 2 | 3.5 | 2.17 | 0 |
| T10 | Backend: Labour Module | T08 | 1.5 | 2 | 3 | 2.08 | 0.5 |
| T11 | Backend: Procurement Module | T08 | 2 | 2.5 | 4 | 2.67 | 0.5 |
| T12 | Backend: DPR Module | T08 | 1 | 1.5 | 2 | 1.5 | 0.5 |
| T13 | Backend: Document + Safety | T09 | 1.5 | 2 | 3 | 2.08 | 0 |
| T14 | Frontend: Auth + Dashboard | T07, T05 | 1.5 | 2 | 3 | 2.08 | 0 |
| T15 | Frontend: Project + Gantt | T08, T14 | 1.5 | 2 | 4 | 2.25 | 0 |
| T16 | Frontend: Budget UI | T09, T15 | 1.5 | 2 | 3 | 2.08 | 0 |
| T17 | Frontend: Labour UI | T10, T15 | 1 | 1.5 | 2.5 | 1.58 | 0.5 |
| T18 | Frontend: Procurement UI | T11, T15 | 1.5 | 2 | 3 | 2.08 | 0.5 |
| T19 | Frontend: DPR + Doc UI | T12, T13, T15 | 1.5 | 2 | 3.5 | 2.17 | 0 |
| T20 | Frontend: Safety + Client Portal | T13, T19 | 1.5 | 2 | 3 | 2.08 | 0 |
| T21 | Frontend: Reporting + Admin | T16, T17, T18, T20 | 1.5 | 2 | 3 | 2.08 | 0 |
| T22 | Integration Testing | T21 | 1 | 2 | 3 | 2.0 | 0 |
| T23 | UAT + Bug Fixes | T22 | 1 | 1.5 | 3 | 1.67 | 0 |
| T24 | Deployment + Documentation | T23 | 0.5 | 1 | 2 | 1.08 | 0 |

**Critical Path Analysis:**
- **Critical Path:** T01 → T02 → T03 → T06 → T07 → T08 → T09 → T13 → T19 → T20 → T21 → T22 → T23 → T24
- **Total Critical Path Duration:** ≈ 28.0 weeks (Expected Time sum)
- **Project Float:** ≈ 2 weeks (buffer for risk mitigation)
- **Key Risk Tasks:** T09 (Budget Module), T13 (Document + Safety), T21 (Reporting) — highest pessimistic estimates.

---

## 5.5 Scope of the Solution

### 5.5.1 In-Scope Features

The following features and functions are explicitly within the scope of the proposed Construction Management System:

1. **Project Lifecycle Management** — Creation, scheduling, tracking, and closure of multiple concurrent construction projects.
2. **Work Breakdown Structure (WBS)** — Hierarchical task decomposition with Gantt chart visualization.
3. **User and Role Management** — 7 distinct role profiles with fine-grained permission control.
4. **Budget and BOQ Management** — BOQ creation, budget approval, expenditure tracking, and EVM metrics.
5. **Labour Attendance and Payroll** — Worker registration, daily attendance, payroll calculation, and statutory report generation.
6. **Material Procurement Cycle** — MRN → RFQ → PO → GRN → Inventory tracking.
7. **Daily Progress Reports (DPR)** — Digital submission with photo attachments and approval workflow.
8. **Document Management** — Version-controlled document repository with metadata and access control.
9. **Safety Inspection and NCR Management** — Digital checklists, incident reporting, and corrective action tracking.
10. **Quality Inspection** — Milestone-based quality checklists and NCR lifecycle management.
11. **Client Portal** — Read-only project visibility for client stakeholders.
12. **Notifications** — Email alerts for critical events (budget breach, task overdue, document approval).
13. **Reporting Suite** — PDF/Excel reports for all major modules.
14. **Audit Trail** — Complete log of all user actions with timestamps.
15. **Dashboard** — Role-specific dashboards with key performance indicators and charts.

### 5.5.2 Out-of-Scope Features

The following are explicitly excluded from the current version of the system:

1. **Building Information Modelling (BIM) Integration** — 3D model viewing and clash detection are not included; this is planned for a future version.
2. **Mobile Native Applications** — The system delivers a responsive web application; native iOS/Android apps are out of scope.
3. **ERP Integration** — Integration with third-party accounting ERP systems (SAP, Tally ERP) is out of scope; it is planned as a future API integration.
4. **Equipment Maintenance Module** — Tracking maintenance schedules for construction machinery (cranes, mixers, JCBs) is out of scope for this version.
5. **GPS/IoT Asset Tracking** — Real-time geolocation tracking of equipment and vehicles using IoT sensors is out of scope.
6. **Automated Drone Survey Integration** — Processing drone survey data for site progress visualization is not included.
7. **Offline/PWA Mode** — While the responsive design supports mobile browsers, a full offline Progressive Web App is planned for a future release.
8. **Multi-Currency and Multi-Language Support** — The system supports only INR and English in this version.
9. **E-Tendering Module** — Online tendering and contractor bidding portal is out of scope.
10. **Subcontractor Self-Service Portal** — A dedicated portal for subcontractors to submit their own bills and reports is planned for a later version.

---
# MCSP-232 Synopsis — Part 2
## Construction Management System

---

# SECTION 6: ANALYSIS MODELS

## 6.1 Data Flow Diagrams (DFD)

A Data Flow Diagram (DFD) graphically represents the flow of data through an information system. It shows how data enters the system, how it is processed, where it is stored, and how it exits the system. DFDs use four symbols: **Process** (circle/rounded rectangle), **External Entity** (rectangle), **Data Store** (open-ended rectangle), and **Data Flow** (arrow).

---

### 6.1.1 Level 0 DFD — Context Diagram

The Context Diagram (Level 0 DFD) represents the entire Construction Management System as a single process and shows all external entities that interact with it.

**External Entities (Actors):**
- **E1 — Administrator:** Manages system configuration, user accounts, and global settings.
- **E2 — Project Manager:** Plans projects, assigns tasks, approves DPRs, monitors budgets.
- **E3 — Site Engineer:** Submits daily progress reports, manages on-site activities.
- **E4 — Supervisor:** Marks labour attendance, supervises daily work.
- **E5 — Accounts Manager:** Records financial transactions, processes payroll, manages invoices.
- **E6 — Store Keeper:** Manages material receipts (GRN), issues, and inventory.
- **E7 — Client:** Views project progress, downloads reports, raises queries.
- **E8 — Vendor/Supplier:** Receives purchase orders, submits invoices (represented externally).
- **E9 — Email Notification Service:** Receives automated trigger data and dispatches email alerts.

**Central Process:** P0 — Construction Management System (CMS)

**Data Flows (Level 0):**

| Flow ID | From | To | Data Description |
|---|---|---|---|
| DF-01 | E1 (Administrator) | P0 (CMS) | User credentials, role assignments, system configuration parameters |
| DF-02 | P0 (CMS) | E1 (Administrator) | System health reports, audit logs, user activity summaries |
| DF-03 | E2 (Project Manager) | P0 (CMS) | Project details, WBS tasks, budget approvals, DPR approvals, task updates |
| DF-04 | P0 (CMS) | E2 (Project Manager) | Project dashboards, budget variance alerts, schedule reports, EVM metrics |
| DF-05 | E3 (Site Engineer) | P0 (CMS) | Daily progress report data, quality inspection results, site photographs |
| DF-06 | P0 (CMS) | E3 (Site Engineer) | Assigned tasks list, approved drawings, inspection checklists, notifications |
| DF-07 | E4 (Supervisor) | P0 (CMS) | Labour attendance records, daily work summary |
| DF-08 | P0 (CMS) | E4 (Supervisor) | Worker list, attendance sheets, safety alerts |
| DF-09 | E5 (Accounts Manager) | P0 (CMS) | Payment vouchers, contractor bills, petty cash entries, payroll confirmation |
| DF-10 | P0 (CMS) | E5 (Accounts Manager) | Budget utilization reports, payroll register, financial statements |
| DF-11 | E6 (Store Keeper) | P0 (CMS) | Goods receipt notes, material issues, material requisition notes |
| DF-12 | P0 (CMS) | E6 (Store Keeper) | Stock status reports, reorder alerts, purchase orders |
| DF-13 | E7 (Client) | P0 (CMS) | Login credentials, queries, feedback |
| DF-14 | P0 (CMS) | E7 (Client) | Progress summaries, milestone reports, financial summaries, site photographs |
| DF-15 | E8 (Vendor) | P0 (CMS) | Quotation responses, delivery challans, invoices (entered by Store Keeper) |
| DF-16 | P0 (CMS) | E8 (Vendor) | Purchase orders, RFQ documents |
| DF-17 | P0 (CMS) | E9 (Email Service) | Alert trigger data (recipient, subject, body, attachment) |
| DF-18 | E9 (Email Service) | E1–E7 (Users) | Email notifications (delivered externally) |

---

### 6.1.2 Level 1 DFD — System Decomposition

The Level 1 DFD decomposes the single central process (P0) into the primary functional subsystems of the CMS. Each subsystem communicates with external entities and shared data stores.

**Level 1 Processes:**

| Process ID | Process Name | Description |
|---|---|---|
| P1 | User Authentication & Authorization | Validates credentials, issues JWT tokens, enforces RBAC |
| P2 | Project Management | Manages project lifecycle, WBS, scheduling, Gantt chart |
| P3 | Budget & Financial Management | Handles BOQ, budget allocation, expenditure tracking, EVM |
| P4 | Labour Management | Worker registration, attendance, payroll computation |
| P5 | Material & Procurement Management | MRN → PO → GRN → Inventory cycle |
| P6 | Daily Progress Reporting | DPR submission, photo upload, approval workflow |
| P7 | Document Management | Upload, version control, categorization, retrieval |
| P8 | Safety & Quality Management | Inspections, NCR lifecycle, incident reporting |
| P9 | Client Portal | Read-only project views, messaging, report download |
| P10 | Notification Engine | Event-driven email/alert dispatch |
| P11 | Reporting & Analytics | Report generation, dashboard aggregation |

**Level 1 Data Stores:**

| Store ID | Store Name | Description |
|---|---|---|
| DS1 | Users & Roles Store | User accounts, role assignments, sessions |
| DS2 | Projects Store | Project master, WBS, schedule, milestones |
| DS3 | Financial Store | BOQ, budget, transactions, contractor bills |
| DS4 | Labour Store | Worker master, attendance records, payroll |
| DS5 | Procurement Store | Material master, MRN, PO, GRN, vendor master, inventory |
| DS6 | DPR Store | Daily reports, photographs, approval status |
| DS7 | Documents Store | File metadata, version history, folder structure |
| DS8 | Safety & Quality Store | Inspection checklists, NCRs, incidents, corrective actions |
| DS9 | Notifications Store | Notification log, delivery status |
| DS10 | Audit Log Store | All system events with timestamps and user IDs |

**Key Level 1 Data Flows:**

| Flow ID | From | To | Data |
|---|---|---|---|
| DF-L1-01 | E1, E2, E3, E4, E5, E6, E7 | P1 | Login credentials (email + password) |
| DF-L1-02 | P1 | DS1 | Token validation result, session record |
| DF-L1-03 | DS1 | P1 | User record, role permissions |
| DF-L1-04 | P1 | All Processes (P2–P11) | Authenticated user identity + permissions |
| DF-L1-05 | E2 | P2 | Project create/update data, task assignments |
| DF-L1-06 | P2 | DS2 | Persisted project data, task records |
| DF-L1-07 | DS2 | P2, P3, P6, P11 | Project records, WBS tasks, schedule data |
| DF-L1-08 | E5 | P3 | Financial transaction data, budget amendments |
| DF-L1-09 | P3 | DS3 | Budget records, expenditure entries |
| DF-L1-10 | DS3 | P3, P10, P11 | Budget data, variance triggers |
| DF-L1-11 | E4 | P4 | Attendance records (present/absent/OT) |
| DF-L1-12 | P4 | DS4 | Attendance data, computed payroll |
| DF-L1-13 | E6 | P5 | GRN data, material issue records |
| DF-L1-14 | E2 | P5 | Purchase order approvals |
| DF-L1-15 | P5 | DS5 | Inventory updates, PO records |
| DF-L1-16 | E3 | P6 | DPR submission data, photographs |
| DF-L1-17 | P6 | DS6 | DPR records |
| DF-L1-18 | E2 | P6 | DPR approval/rejection decision |
| DF-L1-19 | E3, E2 | P7 | Document upload, metadata |
| DF-L1-20 | P7 | DS7 | File metadata, version records |
| DF-L1-21 | E3 | P8 | Inspection data, incident reports |
| DF-L1-22 | P8 | DS8 | Inspection records, NCR records |
| DF-L1-23 | E7 | P9 | Client login, query submission |
| DF-L1-24 | P9 | DS2, DS3, DS6 | Read requests for project/financial/DPR data |
| DF-L1-25 | DS2, DS3, DS6 | P9 | Project summaries, financials, DPRs |
| DF-L1-26 | P9 | E7 | Project dashboard, reports, notifications |
| DF-L1-27 | P3, P2, P8 | P10 | Alert trigger events (budget, deadline, safety) |
| DF-L1-28 | P10 | E9 (Email Service) | Formatted notification payloads |
| DF-L1-29 | P11 | DS2–DS8 | Data read for report aggregation |
| DF-L1-30 | P11 | E2, E5 | Generated reports (PDF, Excel) |

---

### 6.1.3 Level 2 DFD — Decomposition of P3: Budget & Financial Management

This Level 2 DFD further decomposes process P3 (Budget & Financial Management) into sub-processes.

**Sub-Processes of P3:**

| Sub-Process ID | Name | Description |
|---|---|---|
| P3.1 | BOQ Creation & Approval | Create line items, assign quantities and rates, submit for approval |
| P3.2 | Budget Allocation | Distribute approved BOQ total across cost categories and project phases |
| P3.3 | Expenditure Recording | Record actual payments: vendor invoices, contractor bills, petty cash |
| P3.4 | Variance Analysis & EVM | Compare planned vs. actual, compute SV, CV, SPI, CPI |
| P3.5 | Variation Order Management | Process change orders that alter scope or budget |
| P3.6 | Contractor Payment Certification | Certify work completion percentage and generate payment certificates |
| P3.7 | Budget Alert Engine | Monitor thresholds and dispatch alerts to P10 |

**Data Flows within P3:**

| Flow | From | To | Data |
|---|---|---|---|
| DF-P3-01 | E2 (Project Manager) | P3.1 | BOQ line item details |
| DF-P3-02 | P3.1 | DS3 | Saved BOQ records |
| DF-P3-03 | E2 | P3.2 | Budget category allocations |
| DF-P3-04 | P3.2 | DS3 | Budget allocation records |
| DF-P3-05 | E5 (Accounts Manager) | P3.3 | Payment voucher data |
| DF-P3-06 | P3.3 | DS3 | Transaction records |
| DF-P3-07 | DS3 | P3.4 | Budget + expenditure records |
| DF-P3-08 | DS2 (Projects Store) | P3.4 | Planned value data from schedule |
| DF-P3-09 | P3.4 | DS3 | EVM metric results |
| DF-P3-10 | P3.4 | P10 | Variance alert triggers |
| DF-P3-11 | E2 | P3.5 | Variation order details |
| DF-P3-12 | P3.5 | DS3 | Updated budget records |
| DF-P3-13 | E2 | P3.6 | Certified completion percentage |
| DF-P3-14 | P3.6 | DS3 | Payment certificate records |
| DF-P3-15 | DS3 | P3.7 | Current expenditure vs. budget threshold |
| DF-P3-16 | P3.7 | P10 | Alert: "Budget 80% utilized" trigger |

---

### 6.1.4 DFD Data Dictionary

The data dictionary defines the structure of all key data flows used in the DFDs.

| Data Element | Composition | Description |
|---|---|---|
| **Login Credentials** | email (string, 100) + password (string, 255, encrypted) | User authentication input |
| **JWT Token** | header.payload.signature (signed string) | Stateless authentication token |
| **Project Record** | project_id + name + client_id + contract_value + start_date + end_date + status + project_manager_id | Core project entity |
| **WBS Task** | task_id + project_id + parent_task_id + name + planned_start + planned_end + assigned_to + planned_cost + completion_pct + predecessor_ids | Hierarchical task unit |
| **DPR Record** | dpr_id + project_id + submitted_by + date + weather + activities[] + manpower{} + materials_consumed[] + photos[] + status | Daily site report |
| **BOQ Line Item** | boq_id + project_id + item_code + description + unit + estimated_qty + unit_rate + total_cost + category | Budget line item |
| **Attendance Record** | attendance_id + worker_id + project_id + date + status + overtime_hrs + supervisor_id | Daily worker attendance |
| **Material Requisition Note** | mrn_id + project_id + requested_by + date + items[{material_id, qty_required, required_date}] + status | Site material request |
| **Purchase Order** | po_id + mrn_id + vendor_id + items[{material_id, qty, unit_price}] + total_amount + approved_by + status | Procurement order |
| **GRN Record** | grn_id + po_id + received_by + date + items[{material_id, qty_received, condition}] + invoice_no | Goods receipt |
| **Inspection Record** | inspection_id + project_id + type + date + inspector_id + checklist_items[{item, status, remark}] + overall_result | Safety/Quality inspection |
| **NCR** | ncr_id + inspection_id + description + severity + raised_by + assigned_to + due_date + status + closure_evidence | Non-conformance report |
| **Alert Trigger** | event_type + project_id + message + recipients[] + timestamp | Notification dispatch data |

---

## 6.2 Entity Relationship (ER) Diagram

### 6.2.1 Complete Entity List with Attributes

**Entity 1: USER**
- user_id (PK, UUID)
- full_name (VARCHAR 100, NOT NULL)
- email (VARCHAR 150, UNIQUE, NOT NULL)
- password_hash (VARCHAR 255, NOT NULL)
- role (ENUM: ADMIN, PROJECT_MANAGER, SITE_ENGINEER, SUPERVISOR, ACCOUNTS_MANAGER, STORE_KEEPER, CLIENT)
- phone (VARCHAR 15)
- is_active (BOOLEAN, DEFAULT TRUE)
- last_login (TIMESTAMP)
- created_at (TIMESTAMP, NOT NULL)

**Entity 2: PROJECT**
- project_id (PK, UUID)
- project_code (VARCHAR 20, UNIQUE, NOT NULL)
- project_name (VARCHAR 200, NOT NULL)
- project_type (ENUM: RESIDENTIAL, COMMERCIAL, INFRASTRUCTURE, INDUSTRIAL)
- client_id (FK → USER.user_id)
- project_manager_id (FK → USER.user_id)
- location (VARCHAR 300)
- contract_value (DECIMAL 18,2)
- start_date (DATE)
- planned_end_date (DATE)
- actual_end_date (DATE)
- status (ENUM: INITIATED, PLANNING, ACTIVE, ON_HOLD, COMPLETED, CLOSED)
- created_at (TIMESTAMP)

**Entity 3: PROJECT_USER (Junction — M:N between PROJECT and USER)**
- project_user_id (PK, UUID)
- project_id (FK → PROJECT.project_id)
- user_id (FK → USER.user_id)
- role_on_project (VARCHAR 50)
- assigned_date (DATE)

**Entity 4: WBS_TASK**
- task_id (PK, UUID)
- project_id (FK → PROJECT.project_id)
- parent_task_id (FK → WBS_TASK.task_id, self-referencing, NULLABLE)
- task_name (VARCHAR 200, NOT NULL)
- description (TEXT)
- planned_start_date (DATE)
- planned_end_date (DATE)
- actual_start_date (DATE)
- actual_end_date (DATE)
- completion_pct (DECIMAL 5,2, DEFAULT 0)
- planned_cost (DECIMAL 18,2)
- assigned_to (FK → USER.user_id)
- status (ENUM: NOT_STARTED, IN_PROGRESS, COMPLETED, ON_HOLD)
- weight (DECIMAL 5,2)

**Entity 5: TASK_DEPENDENCY**
- dependency_id (PK, UUID)
- task_id (FK → WBS_TASK.task_id)
- predecessor_task_id (FK → WBS_TASK.task_id)
- dependency_type (ENUM: FINISH_TO_START, START_TO_START, FINISH_TO_FINISH)

**Entity 6: BOQ_ITEM**
- boq_id (PK, UUID)
- project_id (FK → PROJECT.project_id)
- item_code (VARCHAR 30)
- description (TEXT, NOT NULL)
- unit (VARCHAR 20)
- estimated_qty (DECIMAL 12,3)
- unit_rate (DECIMAL 12,2)
- total_cost (DECIMAL 18,2, COMPUTED)
- cost_category (ENUM: CIVIL, STRUCTURAL, MEP, FINISHING, CONTINGENCY, OTHER)
- is_approved (BOOLEAN, DEFAULT FALSE)

**Entity 7: FINANCIAL_TRANSACTION**
- transaction_id (PK, UUID)
- project_id (FK → PROJECT.project_id)
- boq_id (FK → BOQ_ITEM.boq_id, NULLABLE)
- transaction_type (ENUM: VENDOR_PAYMENT, CONTRACTOR_BILL, PETTY_CASH, PAYROLL, MISC)
- amount (DECIMAL 18,2, NOT NULL)
- transaction_date (DATE, NOT NULL)
- description (TEXT)
- reference_number (VARCHAR 50)
- recorded_by (FK → USER.user_id)
- approved_by (FK → USER.user_id, NULLABLE)
- invoice_file (VARCHAR 300)

**Entity 8: CONTRACTOR_PAYMENT_CERTIFICATE**
- cpc_id (PK, UUID)
- project_id (FK → PROJECT.project_id)
- contractor_id (FK → USER.user_id)
- certificate_number (VARCHAR 30)
- certified_pct (DECIMAL 5,2)
- gross_amount (DECIMAL 18,2)
- retention_amount (DECIMAL 18,2)
- net_payable (DECIMAL 18,2)
- certified_by (FK → USER.user_id)
- certification_date (DATE)
- status (ENUM: DRAFT, SUBMITTED, APPROVED, PAID)

**Entity 9: VARIATION_ORDER**
- vo_id (PK, UUID)
- project_id (FK → PROJECT.project_id)
- vo_number (VARCHAR 30)
- description (TEXT)
- scope_change (TEXT)
- cost_impact (DECIMAL 18,2)
- time_impact_days (INTEGER)
- requested_by (FK → USER.user_id)
- approved_by (FK → USER.user_id)
- status (ENUM: PENDING, APPROVED, REJECTED)
- approval_date (DATE)

**Entity 10: WORKER**
- worker_id (PK, UUID)
- project_id (FK → PROJECT.project_id)
- full_name (VARCHAR 100, NOT NULL)
- trade_category (ENUM: MASON, CARPENTER, PLUMBER, ELECTRICIAN, WELDER, PAINTER, HELPER, OPERATOR, SUPERVISOR)
- contractor_name (VARCHAR 100)
- id_proof_type (ENUM: AADHAAR, PAN, VOTER_ID, PASSPORT)
- id_proof_number (VARCHAR 30, NOT NULL)
- date_of_joining (DATE)
- daily_wage_rate (DECIMAL 10,2)
- bank_account (VARCHAR 20)
- ifsc_code (VARCHAR 15)
- is_active (BOOLEAN, DEFAULT TRUE)

**Entity 11: ATTENDANCE**
- attendance_id (PK, UUID)
- worker_id (FK → WORKER.worker_id)
- project_id (FK → PROJECT.project_id)
- date (DATE, NOT NULL)
- status (ENUM: PRESENT, ABSENT, HALF_DAY, ON_LEAVE)
- overtime_hours (DECIMAL 4,2, DEFAULT 0)
- marked_by (FK → USER.user_id)
- marked_at (TIMESTAMP)
- UNIQUE (worker_id, date)

**Entity 12: PAYROLL**
- payroll_id (PK, UUID)
- worker_id (FK → WORKER.worker_id)
- project_id (FK → PROJECT.project_id)
- pay_period_start (DATE)
- pay_period_end (DATE)
- total_days_present (DECIMAL 5,1)
- total_overtime_hrs (DECIMAL 6,2)
- basic_wages (DECIMAL 12,2)
- overtime_wages (DECIMAL 12,2)
- gross_wages (DECIMAL 12,2)
- deductions (DECIMAL 12,2)
- net_wages (DECIMAL 12,2)
- payment_status (ENUM: PENDING, PROCESSED, PAID)
- processed_by (FK → USER.user_id)

**Entity 13: MATERIAL_MASTER**
- material_id (PK, UUID)
- material_code (VARCHAR 30, UNIQUE, NOT NULL)
- material_name (VARCHAR 200, NOT NULL)
- unit_of_measure (VARCHAR 20)
- hsn_code (VARCHAR 10)
- category (ENUM: CEMENT, STEEL, AGGREGATE, BRICKS, TIMBER, ELECTRICAL, PLUMBING, HARDWARE, OTHER)
- standard_rate (DECIMAL 12,2)
- reorder_level (DECIMAL 12,3)
- is_active (BOOLEAN, DEFAULT TRUE)

**Entity 14: INVENTORY**
- inventory_id (PK, UUID)
- project_id (FK → PROJECT.project_id)
- material_id (FK → MATERIAL_MASTER.material_id)
- current_stock (DECIMAL 12,3, DEFAULT 0)
- reserved_qty (DECIMAL 12,3, DEFAULT 0)
- last_updated (TIMESTAMP)
- UNIQUE (project_id, material_id)

**Entity 15: VENDOR**
- vendor_id (PK, UUID)
- vendor_name (VARCHAR 200, NOT NULL)
- vendor_code (VARCHAR 20, UNIQUE)
- contact_person (VARCHAR 100)
- email (VARCHAR 150)
- phone (VARCHAR 15)
- address (TEXT)
- gstin (VARCHAR 20)
- pan (VARCHAR 12)
- rating (DECIMAL 3,2)
- is_blacklisted (BOOLEAN, DEFAULT FALSE)
- created_at (TIMESTAMP)

**Entity 16: MATERIAL_REQUISITION_NOTE (MRN)**
- mrn_id (PK, UUID)
- project_id (FK → PROJECT.project_id)
- requested_by (FK → USER.user_id)
- request_date (DATE)
- required_date (DATE)
- status (ENUM: PENDING, APPROVED, CONVERTED_TO_PO, CANCELLED)
- remarks (TEXT)

**Entity 17: MRN_ITEM**
- mrn_item_id (PK, UUID)
- mrn_id (FK → MRN.mrn_id)
- material_id (FK → MATERIAL_MASTER.material_id)
- qty_required (DECIMAL 12,3)
- qty_approved (DECIMAL 12,3)
- remarks (VARCHAR 300)

**Entity 18: PURCHASE_ORDER (PO)**
- po_id (PK, UUID)
- project_id (FK → PROJECT.project_id)
- mrn_id (FK → MRN.mrn_id, NULLABLE)
- vendor_id (FK → VENDOR.vendor_id)
- po_number (VARCHAR 30, UNIQUE)
- po_date (DATE)
- delivery_date (DATE)
- total_amount (DECIMAL 18,2)
- gst_amount (DECIMAL 12,2)
- grand_total (DECIMAL 18,2)
- status (ENUM: DRAFT, APPROVED, SENT, PARTIAL_DELIVERY, COMPLETED, CANCELLED)
- approved_by (FK → USER.user_id)

**Entity 19: PO_ITEM**
- po_item_id (PK, UUID)
- po_id (FK → PURCHASE_ORDER.po_id)
- material_id (FK → MATERIAL_MASTER.material_id)
- qty_ordered (DECIMAL 12,3)
- unit_price (DECIMAL 12,2)
- total_price (DECIMAL 18,2)
- qty_received (DECIMAL 12,3, DEFAULT 0)

**Entity 20: GOODS_RECEIPT_NOTE (GRN)**
- grn_id (PK, UUID)
- po_id (FK → PURCHASE_ORDER.po_id)
- project_id (FK → PROJECT.project_id)
- grn_number (VARCHAR 30, UNIQUE)
- receipt_date (DATE)
- received_by (FK → USER.user_id)
- vendor_invoice_no (VARCHAR 50)
- vendor_invoice_date (DATE)
- remarks (TEXT)

**Entity 21: GRN_ITEM**
- grn_item_id (PK, UUID)
- grn_id (FK → GRN.grn_id)
- material_id (FK → MATERIAL_MASTER.material_id)
- po_item_id (FK → PO_ITEM.po_item_id)
- qty_received (DECIMAL 12,3)
- condition (ENUM: GOOD, DAMAGED, REJECTED)
- storage_location (VARCHAR 100)

**Entity 22: MATERIAL_ISSUE**
- issue_id (PK, UUID)
- project_id (FK → PROJECT.project_id)
- material_id (FK → MATERIAL_MASTER.material_id)
- task_id (FK → WBS_TASK.task_id, NULLABLE)
- issued_to (FK → USER.user_id)
- issue_date (DATE)
- qty_issued (DECIMAL 12,3)
- issued_by (FK → USER.user_id)
- purpose (TEXT)

**Entity 23: DAILY_PROGRESS_REPORT (DPR)**
- dpr_id (PK, UUID)
- project_id (FK → PROJECT.project_id)
- submitted_by (FK → USER.user_id)
- report_date (DATE, NOT NULL)
- weather_condition (ENUM: CLEAR, CLOUDY, RAINY, WINDY, FOGGY)
- overall_remarks (TEXT)
- status (ENUM: DRAFT, SUBMITTED, APPROVED, REJECTED)
- reviewed_by (FK → USER.user_id, NULLABLE)
- review_remarks (TEXT)
- UNIQUE (project_id, report_date)

**Entity 24: DPR_ACTIVITY**
- dpr_activity_id (PK, UUID)
- dpr_id (FK → DPR.dpr_id)
- task_id (FK → WBS_TASK.task_id)
- activity_description (TEXT)
- qty_completed (DECIMAL 12,3)
- unit (VARCHAR 20)
- completion_pct_today (DECIMAL 5,2)

**Entity 25: DPR_MANPOWER**
- dpr_manpower_id (PK, UUID)
- dpr_id (FK → DPR.dpr_id)
- trade_category (VARCHAR 50)
- count_deployed (INTEGER)

**Entity 26: DPR_PHOTO**
- photo_id (PK, UUID)
- dpr_id (FK → DPR.dpr_id)
- file_path (VARCHAR 500)
- caption (VARCHAR 300)
- uploaded_at (TIMESTAMP)

**Entity 27: DOCUMENT**
- document_id (PK, UUID)
- project_id (FK → PROJECT.project_id)
- folder_path (VARCHAR 500)
- document_number (VARCHAR 50)
- title (VARCHAR 300, NOT NULL)
- discipline (ENUM: ARCHITECTURAL, STRUCTURAL, MEP, CIVIL, GEOTECHNICAL, CONTRACT, PERMIT, REPORT, OTHER)
- current_revision (VARCHAR 10)
- status (ENUM: DRAFT, UNDER_REVIEW, APPROVED, SUPERSEDED)
- uploaded_by (FK → USER.user_id)
- uploaded_at (TIMESTAMP)
- file_size (INTEGER)
- file_type (VARCHAR 20)

**Entity 28: DOCUMENT_REVISION**
- revision_id (PK, UUID)
- document_id (FK → DOCUMENT.document_id)
- revision_number (VARCHAR 10)
- file_path (VARCHAR 500)
- uploaded_by (FK → USER.user_id)
- uploaded_at (TIMESTAMP)
- change_description (TEXT)

**Entity 29: SAFETY_INSPECTION**
- inspection_id (PK, UUID)
- project_id (FK → PROJECT.project_id)
- inspection_type (ENUM: ROUTINE, PRE_POUR, SCAFFOLD, ELECTRICAL, FIRE, PERIODIC)
- inspection_date (DATE)
- inspector_id (FK → USER.user_id)
- overall_result (ENUM: PASS, PASS_WITH_OBSERVATION, FAIL)
- remarks (TEXT)

**Entity 30: INSPECTION_CHECKLIST_ITEM**
- item_id (PK, UUID)
- inspection_id (FK → SAFETY_INSPECTION.inspection_id)
- item_description (TEXT)
- result (ENUM: SATISFACTORY, UNSATISFACTORY, NOT_APPLICABLE)
- remark (VARCHAR 300)

**Entity 31: NON_CONFORMANCE_REPORT (NCR)**
- ncr_id (PK, UUID)
- project_id (FK → PROJECT.project_id)
- inspection_id (FK → SAFETY_INSPECTION.inspection_id, NULLABLE)
- ncr_number (VARCHAR 20, UNIQUE)
- description (TEXT, NOT NULL)
- severity (ENUM: MINOR, MAJOR, CRITICAL)
- type (ENUM: SAFETY, QUALITY)
- raised_by (FK → USER.user_id)
- raised_date (DATE)
- assigned_to (FK → USER.user_id)
- due_date (DATE)
- corrective_action (TEXT)
- status (ENUM: OPEN, IN_PROGRESS, CLOSED, OVERDUE)
- closure_date (DATE)
- closure_evidence (VARCHAR 500)

**Entity 32: SAFETY_INCIDENT**
- incident_id (PK, UUID)
- project_id (FK → PROJECT.project_id)
- incident_date (DATE)
- incident_time (TIME)
- location (VARCHAR 200)
- type (ENUM: NEAR_MISS, MINOR_INJURY, MAJOR_INJURY, FATALITY, PROPERTY_DAMAGE)
- description (TEXT)
- personnel_involved (TEXT)
- immediate_action_taken (TEXT)
- reported_by (FK → USER.user_id)
- investigation_status (ENUM: PENDING, UNDER_INVESTIGATION, CLOSED)

**Entity 33: CLIENT_QUERY**
- query_id (PK, UUID)
- project_id (FK → PROJECT.project_id)
- raised_by (FK → USER.user_id)
- subject (VARCHAR 300)
- description (TEXT)
- raised_at (TIMESTAMP)
- status (ENUM: OPEN, IN_PROGRESS, RESOLVED)
- resolved_by (FK → USER.user_id, NULLABLE)
- resolution (TEXT)
- resolved_at (TIMESTAMP)

**Entity 34: NOTIFICATION**
- notification_id (PK, UUID)
- recipient_id (FK → USER.user_id)
- project_id (FK → PROJECT.project_id, NULLABLE)
- event_type (VARCHAR 50)
- message (TEXT)
- is_read (BOOLEAN, DEFAULT FALSE)
- created_at (TIMESTAMP)
- email_sent (BOOLEAN, DEFAULT FALSE)

**Entity 35: AUDIT_LOG**
- log_id (PK, UUID)
- user_id (FK → USER.user_id)
- action (ENUM: CREATE, READ, UPDATE, DELETE, LOGIN, LOGOUT, EXPORT)
- entity_type (VARCHAR 50)
- entity_id (VARCHAR 100)
- old_value (JSONB)
- new_value (JSONB)
- ip_address (VARCHAR 45)
- timestamp (TIMESTAMP, NOT NULL)

---

### 6.2.2 ER Diagram — Cardinality Relationships

| Relationship | Entity A | Cardinality | Entity B | Notes |
|---|---|---|---|---|
| R01 | USER | 1:N | PROJECT (as PM) | One PM manages many projects |
| R02 | USER (Client) | 1:N | PROJECT | One client has many projects |
| R03 | PROJECT | M:N | USER | Via PROJECT_USER junction table |
| R04 | PROJECT | 1:N | WBS_TASK | One project has many WBS tasks |
| R05 | WBS_TASK | 1:N | WBS_TASK | Self-referencing (parent-child hierarchy) |
| R06 | WBS_TASK | M:N | WBS_TASK | Via TASK_DEPENDENCY (predecessor-successor) |
| R07 | PROJECT | 1:N | BOQ_ITEM | One project has many BOQ items |
| R08 | BOQ_ITEM | 1:N | FINANCIAL_TRANSACTION | One BOQ item tracks many transactions |
| R09 | PROJECT | 1:N | FINANCIAL_TRANSACTION | One project has many transactions |
| R10 | PROJECT | 1:N | WORKER | One project employs many workers |
| R11 | WORKER | 1:N | ATTENDANCE | One worker has many attendance records |
| R12 | WORKER | 1:N | PAYROLL | One worker has many payroll records |
| R13 | PROJECT | 1:N | INVENTORY | One project has many inventory records |
| R14 | MATERIAL_MASTER | 1:N | INVENTORY | One material tracked across many projects |
| R15 | PROJECT | 1:N | MRN | One project has many MRNs |
| R16 | MRN | 1:N | MRN_ITEM | One MRN has many material items |
| R17 | MRN | 1:1 | PURCHASE_ORDER | One MRN converted to one PO (1:1 or 1:N) |
| R18 | PURCHASE_ORDER | 1:N | PO_ITEM | One PO has many line items |
| R19 | PURCHASE_ORDER | 1:N | GRN | One PO can have multiple GRNs |
| R20 | GRN | 1:N | GRN_ITEM | One GRN has many received items |
| R21 | VENDOR | 1:N | PURCHASE_ORDER | One vendor receives many POs |
| R22 | PROJECT | 1:N | DPR | One project has many DPRs |
| R23 | DPR | 1:N | DPR_ACTIVITY | One DPR records many activities |
| R24 | DPR | 1:N | DPR_MANPOWER | One DPR has many manpower entries |
| R25 | DPR | 1:N | DPR_PHOTO | One DPR has many photos |
| R26 | PROJECT | 1:N | DOCUMENT | One project has many documents |
| R27 | DOCUMENT | 1:N | DOCUMENT_REVISION | One document has many revisions |
| R28 | PROJECT | 1:N | SAFETY_INSPECTION | One project has many inspections |
| R29 | SAFETY_INSPECTION | 1:N | INSPECTION_CHECKLIST_ITEM | One inspection has many checklist items |
| R30 | SAFETY_INSPECTION | 1:N | NCR | One inspection can raise many NCRs |
| R31 | PROJECT | 1:N | SAFETY_INCIDENT | One project has many incidents |
| R32 | PROJECT | 1:N | CLIENT_QUERY | One project has many client queries |
| R33 | USER | 1:N | NOTIFICATION | One user receives many notifications |
| R34 | USER | 1:N | AUDIT_LOG | One user generates many audit log entries |
| R35 | PROJECT | 1:N | VARIATION_ORDER | One project can have many variation orders |
| R36 | PROJECT | 1:N | CONTRACTOR_PAYMENT_CERTIFICATE | One project generates many payment certificates |
| R37 | MATERIAL_MASTER | 1:N | MATERIAL_ISSUE | One material issued many times |
| R38 | PROJECT | 1:N | MATERIAL_ISSUE | One project has many material issues |

---

## 6.3 UML Diagrams

### 6.3.1 Use-Case Diagram

**Actors and Their Primary Use Cases:**

**Actor 1: Administrator (Admin)**
- UC-01: Manage User Accounts (Create / Edit / Deactivate)
- UC-02: Assign Roles to Users
- UC-03: Configure System Settings
- UC-04: View System Audit Logs
- UC-05: Manage Project Assignments for Users
- UC-06: View All Projects Dashboard

**Actor 2: Project Manager (PM)**
- UC-07: Create and Configure New Project
- UC-08: Define Work Breakdown Structure (WBS)
- UC-09: Assign Tasks to Site Engineers
- UC-10: View Gantt Chart and Schedule
- UC-11: Approve / Reject Daily Progress Reports
- UC-12: Approve Budget and BOQ
- UC-13: Approve Purchase Orders
- UC-14: Review Budget Variance Dashboard
- UC-15: Generate Project Reports
- UC-16: Raise / Approve Variation Orders
- UC-17: Generate Contractor Payment Certificates
- UC-18: Review NCRs and Safety Incidents
- UC-19: Upload / Approve Project Documents
- UC-20: View Client Queries and Assign for Resolution

**Actor 3: Site Engineer**
- UC-21: Submit Daily Progress Report (DPR)
- UC-22: Upload Site Photographs
- UC-23: Conduct Safety Inspections (Fill Digital Checklists)
- UC-24: Raise Non-Conformance Reports (NCRs)
- UC-25: Conduct Quality Inspections
- UC-26: Record Safety Incidents
- UC-27: View Assigned Tasks and Schedule
- UC-28: View Approved Drawings and Documents
- UC-29: Close NCRs with Evidence

**Actor 4: Supervisor**
- UC-30: Mark Daily Labour Attendance
- UC-31: View Worker List for Project
- UC-32: Submit Daily Work Summary
- UC-33: View Attendance Reports

**Actor 5: Accounts Manager**
- UC-34: Record Financial Transactions (Payments, Bills)
- UC-35: Process and Approve Payroll
- UC-36: View Budget Utilization
- UC-37: Export Financial Reports (PDF / Excel)
- UC-38: Record Invoice Against GRN

**Actor 6: Store Keeper**
- UC-39: Raise Material Requisition Note (MRN)
- UC-40: Record Goods Receipt Note (GRN)
- UC-41: Issue Materials from Inventory
- UC-42: View Current Inventory / Stock Levels
- UC-43: Manage Vendor Master Records

**Actor 7: Client**
- UC-44: View Project Progress Dashboard (Read-Only)
- UC-45: View Milestone Achievements and Photos
- UC-46: View Financial Summary (Contract vs. Billed)
- UC-47: Download Approved Reports
- UC-48: Raise / Track Project Queries

**Included (Include) Relationships:**
- UC-21 (Submit DPR) <<include>> UC-22 (Upload Site Photographs) — photos are part of DPR submission.
- UC-23 (Safety Inspection) <<include>> UC-24 (Raise NCR) — NCRs are raised from inspection failures.
- UC-39 (Raise MRN) <<include>> UC-13 (Approve PO) — PM must approve PO triggered by MRN.
- UC-07 (Create Project) <<include>> UC-08 (Define WBS) — WBS is integral to project setup.

**Extended (Extend) Relationships:**
- UC-14 (Budget Variance) <<extend>> UC-16 (Raise Variation Order) — budget breach may trigger VO.
- UC-35 (Process Payroll) <<extend>> UC-34 (Record Transactions) — payroll creates financial transactions.

---

### 6.3.2 Class Diagram

**Key Classes, Attributes, and Methods:**

```
CLASS: User
─────────────────────────────────────
Attributes:
  - userId: UUID
  - fullName: string
  - email: string
  - passwordHash: string
  - role: UserRole (enum)
  - phone: string
  - isActive: boolean
  - lastLogin: DateTime
Methods:
  + authenticate(email, password): JWT
  + updateProfile(data): boolean
  + changePassword(oldPwd, newPwd): boolean
  + deactivate(): boolean
  + getAssignedProjects(): Project[]

CLASS: Project
─────────────────────────────────────
Attributes:
  - projectId: UUID
  - projectCode: string
  - projectName: string
  - projectType: ProjectType (enum)
  - clientId: UUID
  - projectManagerId: UUID
  - contractValue: Decimal
  - startDate: Date
  - plannedEndDate: Date
  - status: ProjectStatus (enum)
Methods:
  + create(data): Project
  + updateStatus(status): boolean
  + getWBSTasks(): WBSTask[]
  + calculateCompletionPct(): Decimal
  + getBudgetSummary(): BudgetSummary
  + getTeamMembers(): User[]

CLASS: WBSTask
─────────────────────────────────────
Attributes:
  - taskId: UUID
  - projectId: UUID
  - parentTaskId: UUID (nullable)
  - taskName: string
  - plannedStartDate: Date
  - plannedEndDate: Date
  - completionPct: Decimal
  - status: TaskStatus (enum)
  - weight: Decimal
Methods:
  + updateCompletion(pct): boolean
  + getChildren(): WBSTask[]
  + getPredecessors(): WBSTask[]
  + isOnCriticalPath(): boolean
  + getPlannedValue(asOfDate): Decimal

CLASS: Budget
─────────────────────────────────────
Attributes:
  - projectId: UUID
  - boqItems: BOQItem[]
  - totalApprovedBudget: Decimal
  - totalCommittedCost: Decimal
  - totalActualCost: Decimal
Methods:
  + addBOQItem(item): BOQItem
  + calculateVariance(): Decimal
  + getEVMMetrics(asOfDate): EVMMetrics
  + checkThresholds(): Alert[]
  + exportBOQ(): Blob

CLASS: EVMMetrics
─────────────────────────────────────
Attributes:
  - plannedValue: Decimal
  - earnedValue: Decimal
  - actualCost: Decimal
  - scheduleVariance: Decimal
  - costVariance: Decimal
  - spi: Decimal
  - cpi: Decimal
Methods:
  + compute(budget, schedule): EVMMetrics
  + getHealthStatus(): string

CLASS: Worker
─────────────────────────────────────
Attributes:
  - workerId: UUID
  - projectId: UUID
  - fullName: string
  - tradeCategory: TradeCategory (enum)
  - dailyWageRate: Decimal
  - isActive: boolean
Methods:
  + registerWorker(data): Worker
  + getAttendanceHistory(from, to): Attendance[]
  + computeMonthlyPayroll(month, year): Payroll
  + getPayrollHistory(): Payroll[]

CLASS: Attendance
─────────────────────────────────────
Attributes:
  - attendanceId: UUID
  - workerId: UUID
  - date: Date
  - status: AttendanceStatus (enum)
  - overtimeHours: Decimal
Methods:
  + markAttendance(workerId, date, status): boolean
  + bulkMark(records): boolean
  + getMonthlyReport(month, year): AttendanceSummary

CLASS: Procurement
─────────────────────────────────────
Attributes:
  - mrn: MRN
  - purchaseOrders: PurchaseOrder[]
  - grns: GRN[]
Methods:
  + raiseMRN(data): MRN
  + createPO(mrnId, vendorId, items): PurchaseOrder
  + recordGRN(poId, items): GRN
  + updateInventory(grnId): boolean
  + getInventoryStatus(projectId, materialId): Inventory

CLASS: DailyProgressReport
─────────────────────────────────────
Attributes:
  - dprId: UUID
  - projectId: UUID
  - reportDate: Date
  - weatherCondition: Weather (enum)
  - activities: DPRActivity[]
  - manpower: DPRManpower[]
  - photos: DPRPhoto[]
  - status: DPRStatus (enum)
Methods:
  + submit(): boolean
  + approve(reviewerId, remarks): boolean
  + reject(reviewerId, remarks): boolean
  + updateTaskCompletion(): boolean
  + generateWeeklySummary(): Report

CLASS: SafetyInspection
─────────────────────────────────────
Attributes:
  - inspectionId: UUID
  - projectId: UUID
  - inspectionType: InspectionType (enum)
  - checklistItems: ChecklistItem[]
  - overallResult: InspectionResult (enum)
Methods:
  + conductInspection(data): SafetyInspection
  + raiseNCR(description, severity): NCR
  + generateReport(): Report

CLASS: NotificationService
─────────────────────────────────────
Attributes:
  - emailConfig: SMTPConfig
Methods:
  + sendEmail(to, subject, body): boolean
  + createInAppNotification(userId, message): Notification
  + dispatchBudgetAlert(project, threshold): boolean
  + dispatchTaskDeadlineAlert(task): boolean
  + dispatchSafetyAlert(incident): boolean
```

**Class Relationships:**
- User **1..*** ——— **1** Project (ProjectManager association)
- Project **1** ——— **\*** WBSTask (Composition)
- Project **1** ——— **1** Budget (Aggregation)
- Budget **1** ——— **\*** BOQItem (Composition)
- Project **1** ——— **\*** Worker (Aggregation)
- Worker **1** ——— **\*** Attendance (Composition)
- Worker **1** ——— **\*** Payroll (Composition)
- Project **1** ——— **\*** DailyProgressReport (Composition)
- DailyProgressReport **1** ——— **\*** DPRActivity (Composition)
- Project **1** ——— **\*** SafetyInspection (Aggregation)
- SafetyInspection **1** ——— **\*** NCR (Dependency — raise)
- NotificationService ——— Budget (Uses — monitors thresholds)
- NotificationService ——— WBSTask (Uses — deadline alerts)

---

### 6.3.3 Sequence Diagram — DPR Submission Workflow

**Scenario:** A Site Engineer submits a Daily Progress Report and the Project Manager approves it.

**Objects/Lifelines:**
- `:SiteEngineer` (Actor)
- `:Browser (React Frontend)`
- `:API Gateway (Express.js)`
- `:AuthMiddleware`
- `:DPRController`
- `:DPRService`
- `:FileUploadService`
- `:Database (PostgreSQL)`
- `:NotificationService`
- `:ProjectManager` (Actor)

**Step-by-Step Interaction:**

```
Step 1:  :SiteEngineer → :Browser
         Action: Navigates to "Submit DPR" form, fills in date,
                 weather, activity details, manpower, selects photos.

Step 2:  :Browser → :API Gateway
         POST /api/v1/dprs
         Headers: { Authorization: "Bearer <JWT_TOKEN>" }
         Body: { project_id, report_date, weather, activities[], manpower[], remarks }
         + multipart photos

Step 3:  :API Gateway → :AuthMiddleware
         Action: verifyJWT(token)
         :AuthMiddleware checks token signature and expiry.

Step 4:  :AuthMiddleware → :API Gateway
         Return: { userId, role: "SITE_ENGINEER", projectIds: [...] }

Step 5:  :API Gateway → :DPRController
         Action: route to dprController.createDPR(req, res)

Step 6:  :DPRController → :FileUploadService
         Action: processPhotos(req.files)
         :FileUploadService compresses images using Sharp,
         generates unique filenames, saves to /uploads/dprs/{project_id}/{date}/

Step 7:  :FileUploadService → :DPRController
         Return: photoUrls[]

Step 8:  :DPRController → :DPRService
         Action: DPRService.createDPR({ ...dprData, photoUrls })

Step 9:  :DPRService → :Database
         Action: BEGIN TRANSACTION
         INSERT INTO daily_progress_reports (project_id, submitted_by,
                report_date, weather_condition, overall_remarks, status='SUBMITTED')
         INSERT INTO dpr_activities (dpr_id, task_id, description,
                qty_completed, completion_pct_today) — for each activity
         INSERT INTO dpr_manpower (dpr_id, trade_category, count_deployed)
         INSERT INTO dpr_photos (dpr_id, file_path, caption)
         COMMIT TRANSACTION

Step 10: :Database → :DPRService
         Return: { dpr_id, status: "SUBMITTED" }

Step 11: :DPRService → :NotificationService
         Action: notifyProjectManager(projectManagerId, dprId, reportDate)

Step 12: :NotificationService → :Database
         INSERT INTO notifications (recipient_id=PM, event_type='DPR_SUBMITTED',
                message='New DPR submitted for [ProjectName] on [date]')
         Action: sendEmail(pmEmail, "DPR Submitted", emailBody)

Step 13: :DPRService → :DPRController
         Return: { success: true, dpr_id }

Step 14: :DPRController → :Browser
         Response: HTTP 201 Created
         Body: { message: "DPR submitted successfully", dpr_id }

Step 15: :Browser → :SiteEngineer
         UI: Shows success toast notification "DPR submitted for review"

--- [Later: PM Approval Workflow] ---

Step 16: :ProjectManager → :Browser
         Action: Clicks notification, opens DPR review screen.

Step 17: :Browser → :API Gateway
         GET /api/v1/dprs/{dpr_id}

Step 18: :API Gateway → :Database
         SELECT dpr + activities + manpower + photos WHERE dpr_id = ?

Step 19: :Database → :Browser
         Return: Full DPR data with photo URLs

Step 20: :ProjectManager → :Browser
         Action: Reviews content, clicks "Approve" button.

Step 21: :Browser → :API Gateway
         PATCH /api/v1/dprs/{dpr_id}/approve
         Body: { review_remarks: "Good progress on Column C3 area" }

Step 22: :API Gateway → :DPRController
         Action: dprController.approveDPR(req, res)

Step 23: :DPRController → :DPRService
         Action: DPRService.approveDPR(dprId, pmId, remarks)

Step 24: :DPRService → :Database
         BEGIN TRANSACTION
         UPDATE daily_progress_reports SET status='APPROVED',
                reviewed_by=pmId, review_remarks=remarks
         UPDATE wbs_tasks SET completion_pct = computed_aggregate_pct
                WHERE task_id IN (DPR activity task_ids)
         COMMIT TRANSACTION

Step 25: :DPRService → :NotificationService
         Action: notifyEngineer(engineerId, "Your DPR for [date] has been approved")

Step 26: :DPRController → :Browser
         Response: HTTP 200 OK { message: "DPR approved" }

Step 27: :Browser → :ProjectManager
         UI: Task completion percentages updated on Gantt chart
```

---

### 6.3.4 Activity Diagram — Material Procurement Workflow

**Description:** This activity diagram models the flow of control from a material shortage trigger to purchase order completion and inventory update.

```
[START]
    ↓
[Store Keeper: Check Current Stock Level]
    ↓
<Decision: Stock Below Reorder Level?>
    ├── NO → [Monitor Stock] → [END]
    └── YES ↓
[Store Keeper: Raise Material Requisition Note (MRN)]
    ↓ (MRN Status = PENDING)
[System: Notify Project Manager of Pending MRN]
    ↓
[Project Manager: Review MRN]
    ↓
<Decision: MRN Approved?>
    ├── REJECTED → [System: Notify Store Keeper of Rejection] → [END]
    └── APPROVED ↓
[MRN Status = APPROVED]
[Project Manager: Select Vendor(s) and Initiate RFQ]
    ↓
[Vendors Submit Quotations]
    ↓
[Project Manager / Accounts: Compare Quotations (Price, Quality, Delivery)]
    ↓
[Project Manager: Create Purchase Order for Selected Vendor]
    ↓
<Decision: PO Amount > Approval Threshold?>
    ├── YES → [Admin Review Required] → [Admin: Approve/Reject PO]
    │           ├── REJECTED → [Notify PM] → [END]
    │           └── APPROVED → [PO Status = APPROVED] ↓
    └── NO → [PO Auto-Approved] ↓
[PO Status = APPROVED]
[System: Send PO to Vendor (Email)]
    ↓
[Wait for Material Delivery]
    ↓
[Vendor Delivers Materials to Site]
    ↓
[Store Keeper: Inspect Delivered Materials]
    ↓
<Decision: Materials Accepted?>
    ├── PARTIALLY/REJECTED → [Record Rejection in GRN] → [Notify Vendor] → [Reorder Process Triggered]
    └── ACCEPTED ↓
[Store Keeper: Record Goods Receipt Note (GRN)]
    ↓
[System: Auto-Update Inventory (Current Stock += Qty Received)]
    ↓
[System: Update PO Status to COMPLETED / PARTIAL]
    ↓
[Accounts Manager: Process Vendor Invoice Against GRN]
    ↓
[System: Record Financial Transaction for PO Payment]
    ↓
[System: Update Budget Expenditure Record]
    ↓
<Decision: Budget Threshold Breached?>
    ├── YES → [System: Send Budget Alert to PM + Accounts Manager]
    └── NO ↓
[END]
```

---

### 6.3.5 State Transition Diagram — Project Lifecycle

**States and Transitions for the PROJECT entity:**

```
States:
  S1: INITIATED
  S2: PLANNING
  S3: ACTIVE
  S4: ON_HOLD
  S5: COMPLETED
  S6: CLOSED

Transitions:
  S1 → S2:  Trigger: Admin/PM clicks "Start Planning"
             Condition: Client assigned, Contract value entered
             Action: Unlock WBS, BOQ creation modules

  S2 → S3:  Trigger: PM clicks "Activate Project"
             Condition: WBS defined, BOQ approved, Team assigned
             Action: Unlock DPR submission, attendance tracking, procurement

  S3 → S4:  Trigger: PM / Admin places project On Hold
             Condition: Any time during execution
             Action: Freeze DPR submission, notify all project team members

  S4 → S3:  Trigger: PM / Admin resumes project
             Condition: Hold reason resolved
             Action: Reactivate DPR submission, notify team

  S3 → S5:  Trigger: PM marks project Completed
             Condition: All WBS tasks ≥ 100% completion, Final payment certificate issued
             Action: Generate project closure report, lock all data entry, notify client

  S5 → S6:  Trigger: Admin closes project after retention period
             Condition: All financial settlements completed
             Action: Archive project data, restrict access to read-only for all roles

  S6 → S3:  (Exceptional) Re-opening a closed project (Admin only, with justification log)
```

**State Transition Table:**

| Current State | Event | Guard Condition | Next State | Action |
|---|---|---|---|---|
| INITIATED | Start Planning | Contract value > 0 | PLANNING | Unlock BOQ, WBS modules |
| PLANNING | Activate Project | BOQ approved = TRUE | ACTIVE | Unlock field modules |
| ACTIVE | Place on Hold | None | ON_HOLD | Freeze entry, notify team |
| ON_HOLD | Resume | Hold reason logged | ACTIVE | Reactivate, notify team |
| ACTIVE | Mark Completed | Completion% = 100% | COMPLETED | Generate closure report |
| COMPLETED | Close Project | All settlements done | CLOSED | Archive, set read-only |
| CLOSED | Re-open (Admin) | Admin justification logged | ACTIVE | Audit log entry created |

---
# MCSP-232 Synopsis — Part 3
## Construction Management System

---

# SECTION 7: DATABASE DESIGN

## 7.1 Complete Database Schema — Exhaustive Table Definitions

The database is implemented in **PostgreSQL 15** and designed to **Third Normal Form (3NF)**. All tables use UUID primary keys for global uniqueness and to facilitate future distributed deployment. TIMESTAMP fields default to `NOW()` and are stored in UTC.

---

### TABLE 1: users

| # | Field Name | Data Type | Size | Constraints | Description |
|---|---|---|---|---|---|
| 1 | user_id | UUID | — | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique user identifier |
| 2 | full_name | VARCHAR | 100 | NOT NULL | User's complete legal name |
| 3 | email | VARCHAR | 150 | UNIQUE, NOT NULL | Login email address |
| 4 | password_hash | VARCHAR | 255 | NOT NULL | bcrypt hash of user password |
| 5 | role | VARCHAR | 30 | NOT NULL, CHECK (role IN ('ADMIN','PROJECT_MANAGER','SITE_ENGINEER','SUPERVISOR','ACCOUNTS_MANAGER','STORE_KEEPER','CLIENT')) | System role |
| 6 | phone | VARCHAR | 15 | — | Contact phone number |
| 7 | profile_picture | VARCHAR | 300 | — | Path to profile image |
| 8 | is_active | BOOLEAN | — | NOT NULL, DEFAULT TRUE | Account active status |
| 9 | failed_login_count | SMALLINT | — | DEFAULT 0 | Consecutive failed logins |
| 10 | locked_until | TIMESTAMP | — | — | Account lock expiry time |
| 11 | last_login | TIMESTAMP | — | — | Last successful login timestamp |
| 12 | reset_token | VARCHAR | 255 | — | Password reset token (hashed) |
| 13 | reset_token_expiry | TIMESTAMP | — | — | Reset token expiry |
| 14 | created_at | TIMESTAMP | — | NOT NULL, DEFAULT NOW() | Record creation time |
| 15 | updated_at | TIMESTAMP | — | DEFAULT NOW() | Last update time |

---

### TABLE 2: projects

| # | Field Name | Data Type | Size | Constraints | Description |
|---|---|---|---|---|---|
| 1 | project_id | UUID | — | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique project identifier |
| 2 | project_code | VARCHAR | 20 | UNIQUE, NOT NULL | Short project reference code |
| 3 | project_name | VARCHAR | 200 | NOT NULL | Full project name |
| 4 | project_type | VARCHAR | 30 | NOT NULL, CHECK IN ('RESIDENTIAL','COMMERCIAL','INFRASTRUCTURE','INDUSTRIAL','RENOVATION') | Construction type |
| 5 | client_id | UUID | — | FOREIGN KEY → users(user_id), NOT NULL | Owning client |
| 6 | project_manager_id | UUID | — | FOREIGN KEY → users(user_id), NOT NULL | Assigned project manager |
| 7 | location | VARCHAR | 300 | — | Physical project site address |
| 8 | latitude | DECIMAL | (10,8) | — | GPS latitude of site |
| 9 | longitude | DECIMAL | (11,8) | — | GPS longitude of site |
| 10 | contract_value | DECIMAL | (18,2) | NOT NULL | Total contract amount (INR) |
| 11 | start_date | DATE | — | NOT NULL | Contractual start date |
| 12 | planned_end_date | DATE | — | NOT NULL | Contractual end date |
| 13 | actual_end_date | DATE | — | — | Actual completion date |
| 14 | status | VARCHAR | 20 | NOT NULL, DEFAULT 'INITIATED' | Lifecycle status |
| 15 | description | TEXT | — | — | Detailed project description |
| 16 | contract_document | VARCHAR | 300 | — | Path to signed contract file |
| 17 | created_at | TIMESTAMP | — | NOT NULL, DEFAULT NOW() | Creation timestamp |
| 18 | updated_at | TIMESTAMP | — | DEFAULT NOW() | Last modification timestamp |

---

### TABLE 3: project_users

| # | Field Name | Data Type | Size | Constraints | Description |
|---|---|---|---|---|---|
| 1 | project_user_id | UUID | — | PRIMARY KEY | Junction table identifier |
| 2 | project_id | UUID | — | FOREIGN KEY → projects(project_id), NOT NULL | Associated project |
| 3 | user_id | UUID | — | FOREIGN KEY → users(user_id), NOT NULL | Team member |
| 4 | role_on_project | VARCHAR | 50 | NOT NULL | Role within this project context |
| 5 | assigned_date | DATE | — | DEFAULT CURRENT_DATE | Date of assignment |
| 6 | UNIQUE | | | UNIQUE(project_id, user_id) | Prevents duplicate assignments |

---

### TABLE 4: wbs_tasks

| # | Field Name | Data Type | Size | Constraints | Description |
|---|---|---|---|---|---|
| 1 | task_id | UUID | — | PRIMARY KEY | Unique task identifier |
| 2 | project_id | UUID | — | FOREIGN KEY → projects(project_id), NOT NULL | Parent project |
| 3 | parent_task_id | UUID | — | FOREIGN KEY → wbs_tasks(task_id) | Parent WBS node (NULL for root) |
| 4 | task_code | VARCHAR | 20 | — | WBS code (e.g., 1.2.3) |
| 5 | task_name | VARCHAR | 200 | NOT NULL | Task description |
| 6 | description | TEXT | — | — | Detailed task scope |
| 7 | planned_start_date | DATE | — | NOT NULL | Scheduled start |
| 8 | planned_end_date | DATE | — | NOT NULL | Scheduled end |
| 9 | actual_start_date | DATE | — | — | Actual start date |
| 10 | actual_end_date | DATE | — | — | Actual end date |
| 11 | completion_pct | DECIMAL | (5,2) | DEFAULT 0, CHECK(>=0 AND <=100) | Completion percentage |
| 12 | planned_cost | DECIMAL | (18,2) | DEFAULT 0 | Estimated task cost |
| 13 | actual_cost | DECIMAL | (18,2) | DEFAULT 0 | Recorded actual cost |
| 14 | assigned_to | UUID | — | FOREIGN KEY → users(user_id) | Responsible engineer |
| 15 | weight | DECIMAL | (5,2) | DEFAULT 1.0 | Relative weight for completion calc |
| 16 | status | VARCHAR | 20 | DEFAULT 'NOT_STARTED' | NOT_STARTED / IN_PROGRESS / COMPLETED / ON_HOLD |
| 17 | created_at | TIMESTAMP | — | DEFAULT NOW() | Creation time |

---

### TABLE 5: task_dependencies

| # | Field Name | Data Type | Size | Constraints | Description |
|---|---|---|---|---|---|
| 1 | dependency_id | UUID | — | PRIMARY KEY | Unique dependency record |
| 2 | task_id | UUID | — | FOREIGN KEY → wbs_tasks(task_id), NOT NULL | Successor task |
| 3 | predecessor_task_id | UUID | — | FOREIGN KEY → wbs_tasks(task_id), NOT NULL | Predecessor task |
| 4 | dependency_type | VARCHAR | 20 | DEFAULT 'FINISH_TO_START' | FS / SS / FF / SF |
| 5 | lag_days | INTEGER | — | DEFAULT 0 | Lag/lead time in days |
| 6 | UNIQUE | | | UNIQUE(task_id, predecessor_task_id) | No duplicate dependencies |

---

### TABLE 6: boq_items

| # | Field Name | Data Type | Size | Constraints | Description |
|---|---|---|---|---|---|
| 1 | boq_id | UUID | — | PRIMARY KEY | BOQ line item identifier |
| 2 | project_id | UUID | — | FOREIGN KEY → projects(project_id), NOT NULL | Associated project |
| 3 | item_code | VARCHAR | 30 | NOT NULL | Standard item reference code |
| 4 | description | TEXT | — | NOT NULL | Item description |
| 5 | unit | VARCHAR | 20 | NOT NULL | Unit of measure (m², m³, kg, LS) |
| 6 | estimated_qty | DECIMAL | (12,3) | NOT NULL | Planned quantity |
| 7 | unit_rate | DECIMAL | (12,2) | NOT NULL | Rate per unit (INR) |
| 8 | total_cost | DECIMAL | (18,2) | GENERATED ALWAYS AS (estimated_qty * unit_rate) | Auto-computed total |
| 9 | cost_category | VARCHAR | 20 | NOT NULL | CIVIL/STRUCTURAL/MEP/FINISHING/CONTINGENCY |
| 10 | task_id | UUID | — | FOREIGN KEY → wbs_tasks(task_id) | Linked WBS task |
| 11 | is_approved | BOOLEAN | — | DEFAULT FALSE | Approval status |
| 12 | approved_by | UUID | — | FOREIGN KEY → users(user_id) | Approving user |
| 13 | approved_at | TIMESTAMP | — | — | Approval timestamp |
| 14 | created_at | TIMESTAMP | — | DEFAULT NOW() | Record creation |

---

### TABLE 7: financial_transactions

| # | Field Name | Data Type | Size | Constraints | Description |
|---|---|---|---|---|---|
| 1 | transaction_id | UUID | — | PRIMARY KEY | Unique financial record |
| 2 | project_id | UUID | — | FOREIGN KEY → projects(project_id), NOT NULL | Parent project |
| 3 | boq_id | UUID | — | FOREIGN KEY → boq_items(boq_id) | Linked BOQ item (optional) |
| 4 | po_id | UUID | — | FOREIGN KEY → purchase_orders(po_id) | Linked PO (if applicable) |
| 5 | grn_id | UUID | — | FOREIGN KEY → goods_receipt_notes(grn_id) | Linked GRN (if applicable) |
| 6 | transaction_type | VARCHAR | 30 | NOT NULL | VENDOR_PAYMENT/CONTRACTOR_BILL/PETTY_CASH/PAYROLL/MISC |
| 7 | amount | DECIMAL | (18,2) | NOT NULL, CHECK(>0) | Transaction amount (INR) |
| 8 | gst_amount | DECIMAL | (12,2) | DEFAULT 0 | GST component |
| 9 | total_amount | DECIMAL | (18,2) | NOT NULL | Total including GST |
| 10 | transaction_date | DATE | — | NOT NULL | Date of payment |
| 11 | description | TEXT | — | — | Narration / voucher description |
| 12 | reference_number | VARCHAR | 50 | — | Voucher/cheque/UTR number |
| 13 | invoice_file | VARCHAR | 300 | — | Path to invoice scan |
| 14 | recorded_by | UUID | — | FOREIGN KEY → users(user_id), NOT NULL | Recording accounts manager |
| 15 | approved_by | UUID | — | FOREIGN KEY → users(user_id) | Approving PM |
| 16 | created_at | TIMESTAMP | — | DEFAULT NOW() | Record creation |

---

### TABLE 8: workers

| # | Field Name | Data Type | Size | Constraints | Description |
|---|---|---|---|---|---|
| 1 | worker_id | UUID | — | PRIMARY KEY | Unique worker identifier |
| 2 | project_id | UUID | — | FOREIGN KEY → projects(project_id), NOT NULL | Project where employed |
| 3 | full_name | VARCHAR | 100 | NOT NULL | Worker's full name |
| 4 | trade_category | VARCHAR | 30 | NOT NULL | MASON/CARPENTER/PLUMBER/ELECTRICIAN/etc. |
| 5 | contractor_name | VARCHAR | 100 | — | Subcontractor/labour contractor name |
| 6 | id_proof_type | VARCHAR | 20 | NOT NULL | AADHAAR/PAN/VOTER_ID/PASSPORT |
| 7 | id_proof_number | VARCHAR | 30 | NOT NULL | ID document number |
| 8 | date_of_joining | DATE | — | NOT NULL | Joining date |
| 9 | date_of_leaving | DATE | — | — | Leaving date (NULL if active) |
| 10 | daily_wage_rate | DECIMAL | (10,2) | NOT NULL | Base daily wage (INR) |
| 11 | bank_account | VARCHAR | 20 | — | Bank account number |
| 12 | ifsc_code | VARCHAR | 15 | — | IFSC code of bank branch |
| 13 | emergency_contact | VARCHAR | 100 | — | Emergency contact name and phone |
| 14 | photo | VARCHAR | 300 | — | Worker photo file path |
| 15 | is_active | BOOLEAN | — | DEFAULT TRUE | Active employment status |
| 16 | created_at | TIMESTAMP | — | DEFAULT NOW() | Registration timestamp |

---

### TABLE 9: attendance

| # | Field Name | Data Type | Size | Constraints | Description |
|---|---|---|---|---|---|
| 1 | attendance_id | UUID | — | PRIMARY KEY | Unique attendance record |
| 2 | worker_id | UUID | — | FOREIGN KEY → workers(worker_id), NOT NULL | Worker reference |
| 3 | project_id | UUID | — | FOREIGN KEY → projects(project_id), NOT NULL | Site/project |
| 4 | date | DATE | — | NOT NULL | Attendance date |
| 5 | status | VARCHAR | 15 | NOT NULL, DEFAULT 'ABSENT' | PRESENT/ABSENT/HALF_DAY/ON_LEAVE |
| 6 | overtime_hours | DECIMAL | (4,2) | DEFAULT 0, CHECK(>=0 AND <=12) | Overtime hours worked |
| 7 | marked_by | UUID | — | FOREIGN KEY → users(user_id), NOT NULL | Supervisor who marked |
| 8 | marked_at | TIMESTAMP | — | DEFAULT NOW() | Time of marking |
| 9 | UNIQUE | | | UNIQUE(worker_id, date) | One record per worker per day |

---

### TABLE 10: payroll

| # | Field Name | Data Type | Size | Constraints | Description |
|---|---|---|---|---|---|
| 1 | payroll_id | UUID | — | PRIMARY KEY | Payroll record identifier |
| 2 | worker_id | UUID | — | FOREIGN KEY → workers(worker_id), NOT NULL | Worker |
| 3 | project_id | UUID | — | FOREIGN KEY → projects(project_id), NOT NULL | Project |
| 4 | pay_period_start | DATE | — | NOT NULL | Start of pay period |
| 5 | pay_period_end | DATE | — | NOT NULL | End of pay period |
| 6 | total_days_present | DECIMAL | (5,1) | NOT NULL | Working days (0.5 for half-day) |
| 7 | total_overtime_hours | DECIMAL | (6,2) | DEFAULT 0 | Total OT hours |
| 8 | basic_wages | DECIMAL | (12,2) | NOT NULL | Days × Daily Rate |
| 9 | overtime_wages | DECIMAL | (12,2) | DEFAULT 0 | OT hours × (Daily Rate / 8) × 2 |
| 10 | allowances | DECIMAL | (12,2) | DEFAULT 0 | HRA, travel, other allowances |
| 11 | gross_wages | DECIMAL | (12,2) | NOT NULL | Basic + OT + Allowances |
| 12 | pf_deduction | DECIMAL | (12,2) | DEFAULT 0 | Provident Fund deduction (12%) |
| 13 | esi_deduction | DECIMAL | (12,2) | DEFAULT 0 | Employee State Insurance deduction |
| 14 | other_deductions | DECIMAL | (12,2) | DEFAULT 0 | Advance recovery etc. |
| 15 | net_wages | DECIMAL | (12,2) | NOT NULL | Gross - Total Deductions |
| 16 | payment_status | VARCHAR | 15 | DEFAULT 'PENDING' | PENDING/PROCESSED/PAID |
| 17 | payment_date | DATE | — | — | Date when paid |
| 18 | processed_by | UUID | — | FOREIGN KEY → users(user_id) | Accounts manager |
| 19 | created_at | TIMESTAMP | — | DEFAULT NOW() | Record creation |

---

### TABLE 11: material_master

| # | Field Name | Data Type | Size | Constraints | Description |
|---|---|---|---|---|---|
| 1 | material_id | UUID | — | PRIMARY KEY | Material identifier |
| 2 | material_code | VARCHAR | 30 | UNIQUE, NOT NULL | Standard material code |
| 3 | material_name | VARCHAR | 200 | NOT NULL | Full material description |
| 4 | unit_of_measure | VARCHAR | 20 | NOT NULL | kg/bag/m³/m²/nos/litre |
| 5 | hsn_code | VARCHAR | 10 | — | HSN code for GST |
| 6 | gst_rate | DECIMAL | (5,2) | DEFAULT 18.00 | Applicable GST rate (%) |
| 7 | category | VARCHAR | 30 | NOT NULL | CEMENT/STEEL/AGGREGATE/BRICKS/etc. |
| 8 | standard_rate | DECIMAL | (12,2) | — | Current market rate per unit |
| 9 | reorder_level | DECIMAL | (12,3) | DEFAULT 0 | Minimum stock threshold |
| 10 | specifications | TEXT | — | — | Technical specifications |
| 11 | is_active | BOOLEAN | — | DEFAULT TRUE | Active status |
| 12 | created_at | TIMESTAMP | — | DEFAULT NOW() | Creation timestamp |

---

### TABLE 12: inventory

| # | Field Name | Data Type | Size | Constraints | Description |
|---|---|---|---|---|---|
| 1 | inventory_id | UUID | — | PRIMARY KEY | Inventory record identifier |
| 2 | project_id | UUID | — | FOREIGN KEY → projects(project_id), NOT NULL | Project site |
| 3 | material_id | UUID | — | FOREIGN KEY → material_master(material_id), NOT NULL | Material |
| 4 | current_stock | DECIMAL | (12,3) | NOT NULL, DEFAULT 0 | Available stock qty |
| 5 | reserved_qty | DECIMAL | (12,3) | DEFAULT 0 | Committed but not yet issued |
| 6 | total_received | DECIMAL | (12,3) | DEFAULT 0 | Cumulative GRN quantity |
| 7 | total_issued | DECIMAL | (12,3) | DEFAULT 0 | Cumulative issued quantity |
| 8 | last_updated | TIMESTAMP | — | DEFAULT NOW() | Last stock update time |
| 9 | UNIQUE | | | UNIQUE(project_id, material_id) | One record per material per site |

---

### TABLE 13: vendors

| # | Field Name | Data Type | Size | Constraints | Description |
|---|---|---|---|---|---|
| 1 | vendor_id | UUID | — | PRIMARY KEY | Vendor identifier |
| 2 | vendor_code | VARCHAR | 20 | UNIQUE, NOT NULL | Internal vendor code |
| 3 | vendor_name | VARCHAR | 200 | NOT NULL | Company/individual name |
| 4 | contact_person | VARCHAR | 100 | — | Primary contact name |
| 5 | email | VARCHAR | 150 | — | Email address |
| 6 | phone | VARCHAR | 15 | — | Phone number |
| 7 | address | TEXT | — | — | Registered address |
| 8 | city | VARCHAR | 50 | — | City |
| 9 | state | VARCHAR | 50 | — | State |
| 10 | pincode | VARCHAR | 10 | — | PIN code |
| 11 | gstin | VARCHAR | 20 | UNIQUE | GST Identification Number |
| 12 | pan | VARCHAR | 12 | — | PAN card number |
| 13 | bank_account | VARCHAR | 20 | — | Bank account number |
| 14 | ifsc_code | VARCHAR | 15 | — | IFSC code |
| 15 | rating | DECIMAL | (3,2) | CHECK(>=0 AND <=5) | Performance rating (0–5) |
| 16 | is_blacklisted | BOOLEAN | — | DEFAULT FALSE | Blacklist status |
| 17 | blacklist_reason | TEXT | — | — | Reason if blacklisted |
| 18 | created_at | TIMESTAMP | — | DEFAULT NOW() | Registration date |

---

### TABLE 14: material_requisition_notes

| # | Field Name | Data Type | Size | Constraints | Description |
|---|---|---|---|---|---|
| 1 | mrn_id | UUID | — | PRIMARY KEY | MRN identifier |
| 2 | mrn_number | VARCHAR | 20 | UNIQUE, NOT NULL | Sequential MRN number |
| 3 | project_id | UUID | — | FOREIGN KEY → projects(project_id), NOT NULL | Project site |
| 4 | requested_by | UUID | — | FOREIGN KEY → users(user_id), NOT NULL | Store keeper who raised |
| 5 | request_date | DATE | — | NOT NULL, DEFAULT CURRENT_DATE | Date raised |
| 6 | required_date | DATE | — | NOT NULL | Material needed by date |
| 7 | status | VARCHAR | 20 | DEFAULT 'PENDING' | PENDING/APPROVED/CONVERTED_TO_PO/CANCELLED |
| 8 | approved_by | UUID | — | FOREIGN KEY → users(user_id) | PM who approved |
| 9 | remarks | TEXT | — | — | Any additional notes |
| 10 | created_at | TIMESTAMP | — | DEFAULT NOW() | Creation timestamp |

---

### TABLE 15: mrn_items

| # | Field Name | Data Type | Size | Constraints | Description |
|---|---|---|---|---|---|
| 1 | mrn_item_id | UUID | — | PRIMARY KEY | Line item identifier |
| 2 | mrn_id | UUID | — | FOREIGN KEY → material_requisition_notes(mrn_id), NOT NULL | Parent MRN |
| 3 | material_id | UUID | — | FOREIGN KEY → material_master(material_id), NOT NULL | Material requested |
| 4 | qty_required | DECIMAL | (12,3) | NOT NULL, CHECK(>0) | Requested quantity |
| 5 | qty_approved | DECIMAL | (12,3) | — | Approved quantity (may differ) |
| 6 | purpose | VARCHAR | 300 | — | Intended use (WBS task reference) |
| 7 | remarks | VARCHAR | 300 | — | Any notes by approver |

---

### TABLE 16: purchase_orders

| # | Field Name | Data Type | Size | Constraints | Description |
|---|---|---|---|---|---|
| 1 | po_id | UUID | — | PRIMARY KEY | PO identifier |
| 2 | po_number | VARCHAR | 30 | UNIQUE, NOT NULL | Sequential PO number |
| 3 | project_id | UUID | — | FOREIGN KEY → projects(project_id), NOT NULL | Project |
| 4 | mrn_id | UUID | — | FOREIGN KEY → material_requisition_notes(mrn_id) | Source MRN |
| 5 | vendor_id | UUID | — | FOREIGN KEY → vendors(vendor_id), NOT NULL | Supplier |
| 6 | po_date | DATE | — | NOT NULL, DEFAULT CURRENT_DATE | Issue date |
| 7 | expected_delivery | DATE | — | NOT NULL | Expected delivery date |
| 8 | delivery_address | TEXT | — | — | Site delivery address |
| 9 | subtotal | DECIMAL | (18,2) | NOT NULL | Total before GST |
| 10 | gst_amount | DECIMAL | (12,2) | DEFAULT 0 | GST component |
| 11 | grand_total | DECIMAL | (18,2) | NOT NULL | Total payable to vendor |
| 12 | payment_terms | VARCHAR | 200 | — | Payment terms (Net 30, etc.) |
| 13 | status | VARCHAR | 20 | DEFAULT 'DRAFT' | DRAFT/APPROVED/SENT/PARTIAL/COMPLETED/CANCELLED |
| 14 | approved_by | UUID | — | FOREIGN KEY → users(user_id) | PM who approved |
| 15 | approved_at | TIMESTAMP | — | — | Approval timestamp |
| 16 | created_by | UUID | — | FOREIGN KEY → users(user_id), NOT NULL | Created by user |
| 17 | created_at | TIMESTAMP | — | DEFAULT NOW() | Creation time |

---

### TABLE 17: po_items

| # | Field Name | Data Type | Size | Constraints | Description |
|---|---|---|---|---|---|
| 1 | po_item_id | UUID | — | PRIMARY KEY | PO line item identifier |
| 2 | po_id | UUID | — | FOREIGN KEY → purchase_orders(po_id), NOT NULL | Parent PO |
| 3 | material_id | UUID | — | FOREIGN KEY → material_master(material_id), NOT NULL | Material ordered |
| 4 | qty_ordered | DECIMAL | (12,3) | NOT NULL, CHECK(>0) | Ordered quantity |
| 5 | unit_price | DECIMAL | (12,2) | NOT NULL | Agreed price per unit |
| 6 | gst_rate | DECIMAL | (5,2) | DEFAULT 18.0 | GST rate for this item |
| 7 | total_price | DECIMAL | (18,2) | GENERATED ALWAYS AS (qty_ordered * unit_price) | Line total |
| 8 | qty_received | DECIMAL | (12,3) | DEFAULT 0 | Cumulative received qty |
| 9 | specifications | TEXT | — | — | Grade/quality specs |

---

### TABLE 18: goods_receipt_notes

| # | Field Name | Data Type | Size | Constraints | Description |
|---|---|---|---|---|---|
| 1 | grn_id | UUID | — | PRIMARY KEY | GRN identifier |
| 2 | grn_number | VARCHAR | 30 | UNIQUE, NOT NULL | Sequential GRN number |
| 3 | po_id | UUID | — | FOREIGN KEY → purchase_orders(po_id), NOT NULL | Source PO |
| 4 | project_id | UUID | — | FOREIGN KEY → projects(project_id), NOT NULL | Project site |
| 5 | receipt_date | DATE | — | NOT NULL | Date of receipt |
| 6 | received_by | UUID | — | FOREIGN KEY → users(user_id), NOT NULL | Store keeper |
| 7 | vendor_invoice_number | VARCHAR | 50 | — | Supplier invoice number |
| 8 | vendor_invoice_date | DATE | — | — | Supplier invoice date |
| 9 | vehicle_number | VARCHAR | 20 | — | Delivery vehicle number |
| 10 | remarks | TEXT | — | — | Any notes on delivery |
| 11 | created_at | TIMESTAMP | — | DEFAULT NOW() | GRN creation time |

---

### TABLE 19: grn_items

| # | Field Name | Data Type | Size | Constraints | Description |
|---|---|---|---|---|---|
| 1 | grn_item_id | UUID | — | PRIMARY KEY | GRN line item identifier |
| 2 | grn_id | UUID | — | FOREIGN KEY → goods_receipt_notes(grn_id), NOT NULL | Parent GRN |
| 3 | po_item_id | UUID | — | FOREIGN KEY → po_items(po_item_id), NOT NULL | Corresponding PO item |
| 4 | material_id | UUID | — | FOREIGN KEY → material_master(material_id), NOT NULL | Material |
| 5 | qty_received | DECIMAL | (12,3) | NOT NULL, CHECK(>0) | Quantity received |
| 6 | qty_accepted | DECIMAL | (12,3) | NOT NULL | Accepted after inspection |
| 7 | qty_rejected | DECIMAL | (12,3) | DEFAULT 0 | Rejected quantity |
| 8 | condition | VARCHAR | 20 | DEFAULT 'GOOD' | GOOD/DAMAGED/REJECTED |
| 9 | storage_location | VARCHAR | 100 | — | On-site storage bay/location |
| 10 | rejection_reason | VARCHAR | 300 | — | Reason for rejection (if any) |

---

### TABLE 20: daily_progress_reports

| # | Field Name | Data Type | Size | Constraints | Description |
|---|---|---|---|---|---|
| 1 | dpr_id | UUID | — | PRIMARY KEY | DPR identifier |
| 2 | project_id | UUID | — | FOREIGN KEY → projects(project_id), NOT NULL | Project |
| 3 | submitted_by | UUID | — | FOREIGN KEY → users(user_id), NOT NULL | Site engineer |
| 4 | report_date | DATE | — | NOT NULL | Date of the report |
| 5 | weather_condition | VARCHAR | 20 | DEFAULT 'CLEAR' | CLEAR/CLOUDY/RAINY/WINDY/FOGGY |
| 6 | overall_remarks | TEXT | — | — | General site observations |
| 7 | issues_raised | TEXT | — | — | Any problems or blockers |
| 8 | status | VARCHAR | 15 | DEFAULT 'DRAFT' | DRAFT/SUBMITTED/APPROVED/REJECTED |
| 9 | reviewed_by | UUID | — | FOREIGN KEY → users(user_id) | PM reviewer |
| 10 | review_remarks | TEXT | — | — | PM's comments |
| 11 | reviewed_at | TIMESTAMP | — | — | Review timestamp |
| 12 | created_at | TIMESTAMP | — | DEFAULT NOW() | Submission time |
| 13 | UNIQUE | | | UNIQUE(project_id, report_date) | One DPR per project per day |

---

### TABLE 21: dpr_activities

| # | Field Name | Data Type | Size | Constraints | Description |
|---|---|---|---|---|---|
| 1 | dpr_activity_id | UUID | — | PRIMARY KEY | Activity record identifier |
| 2 | dpr_id | UUID | — | FOREIGN KEY → daily_progress_reports(dpr_id), NOT NULL | Parent DPR |
| 3 | task_id | UUID | — | FOREIGN KEY → wbs_tasks(task_id), NOT NULL | WBS task reference |
| 4 | activity_description | TEXT | — | NOT NULL | Description of work done |
| 5 | qty_completed | DECIMAL | (12,3) | — | Quantity completed today |
| 6 | unit | VARCHAR | 20 | — | Unit of measurement |
| 7 | cumulative_completion_pct | DECIMAL | (5,2) | — | Total task completion after today |
| 8 | remarks | VARCHAR | 300 | — | Additional notes |

---

### TABLE 22: safety_inspections

| # | Field Name | Data Type | Size | Constraints | Description |
|---|---|---|---|---|---|
| 1 | inspection_id | UUID | — | PRIMARY KEY | Inspection identifier |
| 2 | project_id | UUID | — | FOREIGN KEY → projects(project_id), NOT NULL | Project |
| 3 | inspection_type | VARCHAR | 30 | NOT NULL | ROUTINE/PRE_POUR/SCAFFOLD/ELECTRICAL/FIRE/PERIODIC |
| 4 | inspection_date | DATE | — | NOT NULL | Date of inspection |
| 5 | inspector_id | UUID | — | FOREIGN KEY → users(user_id), NOT NULL | Conducting inspector |
| 6 | construction_stage | VARCHAR | 100 | — | Stage description |
| 7 | overall_result | VARCHAR | 30 | NOT NULL | PASS/PASS_WITH_OBSERVATION/FAIL |
| 8 | remarks | TEXT | — | — | General observations |
| 9 | follow_up_required | BOOLEAN | — | DEFAULT FALSE | Follow-up needed? |
| 10 | follow_up_date | DATE | — | — | Scheduled follow-up date |
| 11 | created_at | TIMESTAMP | — | DEFAULT NOW() | Record creation |

---

### TABLE 23: non_conformance_reports

| # | Field Name | Data Type | Size | Constraints | Description |
|---|---|---|---|---|---|
| 1 | ncr_id | UUID | — | PRIMARY KEY | NCR identifier |
| 2 | ncr_number | VARCHAR | 20 | UNIQUE, NOT NULL | Sequential NCR reference |
| 3 | project_id | UUID | — | FOREIGN KEY → projects(project_id), NOT NULL | Project |
| 4 | inspection_id | UUID | — | FOREIGN KEY → safety_inspections(inspection_id) | Source inspection |
| 5 | description | TEXT | — | NOT NULL | Non-conformance details |
| 6 | severity | VARCHAR | 10 | NOT NULL | MINOR/MAJOR/CRITICAL |
| 7 | type | VARCHAR | 15 | NOT NULL | SAFETY/QUALITY |
| 8 | root_cause | TEXT | — | — | Root cause analysis |
| 9 | corrective_action | TEXT | — | — | Prescribed corrective action |
| 10 | raised_by | UUID | — | FOREIGN KEY → users(user_id), NOT NULL | NCR originator |
| 11 | raised_date | DATE | — | NOT NULL, DEFAULT CURRENT_DATE | Date raised |
| 12 | assigned_to | UUID | — | FOREIGN KEY → users(user_id), NOT NULL | Responsible person |
| 13 | due_date | DATE | — | NOT NULL | Closure deadline |
| 14 | status | VARCHAR | 15 | DEFAULT 'OPEN' | OPEN/IN_PROGRESS/CLOSED/OVERDUE |
| 15 | closure_date | DATE | — | — | Actual closure date |
| 16 | closure_evidence | VARCHAR | 500 | — | File path to closure proof |
| 17 | closed_by | UUID | — | FOREIGN KEY → users(user_id) | Verification user |
| 18 | created_at | TIMESTAMP | — | DEFAULT NOW() | Record creation |

---

### TABLE 24: documents

| # | Field Name | Data Type | Size | Constraints | Description |
|---|---|---|---|---|---|
| 1 | document_id | UUID | — | PRIMARY KEY | Document identifier |
| 2 | project_id | UUID | — | FOREIGN KEY → projects(project_id), NOT NULL | Project |
| 3 | folder_path | VARCHAR | 500 | — | Virtual folder path |
| 4 | document_number | VARCHAR | 50 | — | Standard drawing number |
| 5 | title | VARCHAR | 300 | NOT NULL | Document title |
| 6 | discipline | VARCHAR | 30 | NOT NULL | ARCHITECTURAL/STRUCTURAL/MEP/CIVIL/CONTRACT/PERMIT/REPORT |
| 7 | current_revision | VARCHAR | 10 | DEFAULT 'R0' | Latest revision code |
| 8 | status | VARCHAR | 20 | DEFAULT 'DRAFT' | DRAFT/UNDER_REVIEW/APPROVED/SUPERSEDED |
| 9 | file_type | VARCHAR | 10 | NOT NULL | PDF/DWG/JPG/XLSX/DOCX |
| 10 | file_size | INTEGER | — | — | File size in bytes |
| 11 | uploaded_by | UUID | — | FOREIGN KEY → users(user_id), NOT NULL | Uploading user |
| 12 | uploaded_at | TIMESTAMP | — | DEFAULT NOW() | Upload time |
| 13 | access_level | VARCHAR | 20 | DEFAULT 'TEAM' | PUBLIC/TEAM/MANAGEMENT/CLIENT |

---

### TABLE 25: audit_logs

| # | Field Name | Data Type | Size | Constraints | Description |
|---|---|---|---|---|---|
| 1 | log_id | UUID | — | PRIMARY KEY | Audit log identifier |
| 2 | user_id | UUID | — | FOREIGN KEY → users(user_id) | Acting user (NULL for system) |
| 3 | action | VARCHAR | 20 | NOT NULL | CREATE/READ/UPDATE/DELETE/LOGIN/LOGOUT/EXPORT |
| 4 | entity_type | VARCHAR | 50 | NOT NULL | Table/entity name affected |
| 5 | entity_id | VARCHAR | 100 | — | Affected record ID |
| 6 | old_value | JSONB | — | — | Previous state (for updates) |
| 7 | new_value | JSONB | — | — | New state (for creates/updates) |
| 8 | ip_address | INET | — | — | Client IP address |
| 9 | user_agent | VARCHAR | 300 | — | Browser/client user agent |
| 10 | timestamp | TIMESTAMP | — | NOT NULL, DEFAULT NOW() | Event timestamp |

---

## 7.2 Database Normalization Analysis

### 7.2.1 First Normal Form (1NF)
All tables in the CMS database satisfy 1NF because:
- Every table has a primary key (UUID) that uniquely identifies each row.
- All attribute values are atomic (no multi-valued or composite attributes stored in a single cell).
- Multi-valued data (e.g., MRN items, DPR activities, PO line items) are stored in separate child tables (mrn_items, dpr_activities, po_items) rather than in comma-separated lists.
- Every column contains values of a single data type.

**Example of 1NF compliance:** Instead of storing materials in a single MRN row as `materials = "Cement 50bags, Steel 2MT"`, the system uses a separate `mrn_items` table with one row per material, each row containing `mrn_id`, `material_id`, `qty_required` — all atomic values.

### 7.2.2 Second Normal Form (2NF)
All tables satisfy 2NF because:
- All tables use single-column primary keys (UUID), so there can be no partial dependencies on a composite key.
- Every non-key attribute in every table is fully functionally dependent on the entire primary key.

**Example of 2NF compliance:** In the `attendance` table, the attributes `status`, `overtime_hours`, `marked_by`, and `marked_at` are all dependent on the full composite candidate key `(worker_id, date)`. These attributes describe the attendance event itself, not just the worker or just the date in isolation.

### 7.2.3 Third Normal Form (3NF)
All tables satisfy 3NF because:
- There are no transitive dependencies: no non-key attribute depends on another non-key attribute.
- Derived/computed values are either stored as generated columns (e.g., `total_cost = estimated_qty * unit_rate` in `boq_items`) or computed at the application layer at query time, never stored redundantly.

**Example of 3NF compliance:** In the `purchase_orders` table, `vendor_name`, `vendor_phone`, and `vendor_email` are NOT stored — only `vendor_id` (foreign key) is stored. Vendor details are retrieved by joining the `vendors` table. This eliminates the transitive dependency `po_id → vendor_id → vendor_name`.

**Example of a potential 3NF violation that was corrected:** An early design stored `project_manager_name` in the `projects` table. This was a transitive dependency: `project_id → project_manager_id → project_manager_name`. The violation was corrected by removing `project_manager_name` and using only the foreign key `project_manager_id`, retrieving the name via JOIN on the `users` table.

### 7.2.4 Database Indexing Strategy

| Index Name | Table | Columns | Index Type | Purpose |
|---|---|---|---|---|
| idx_users_email | users | email | UNIQUE B-TREE | Fast login lookup |
| idx_projects_client | projects | client_id | B-TREE | Client's projects |
| idx_projects_pm | projects | project_manager_id | B-TREE | PM's projects |
| idx_wbs_project | wbs_tasks | project_id | B-TREE | Tasks by project |
| idx_wbs_parent | wbs_tasks | parent_task_id | B-TREE | Hierarchy navigation |
| idx_attendance_worker_date | attendance | (worker_id, date) | UNIQUE B-TREE | Uniqueness + lookup |
| idx_inventory_project_material | inventory | (project_id, material_id) | UNIQUE B-TREE | Stock lookup |
| idx_dpr_project_date | daily_progress_reports | (project_id, report_date) | UNIQUE B-TREE | Daily report lookup |
| idx_audit_user | audit_logs | user_id | B-TREE | Audit by user |
| idx_audit_timestamp | audit_logs | timestamp | B-TREE | Chronological audit |
| idx_transactions_project | financial_transactions | project_id | B-TREE | Budget calculations |
| idx_ncr_project_status | non_conformance_reports | (project_id, status) | B-TREE | Open NCRs |

---

# SECTION 8: PROJECT STRUCTURE & MODULES

## 8.1 Module Overview

The Construction Management System comprises **10 primary modules**, organized in a three-tier architecture (Presentation → Business Logic → Data). Each module is self-contained with its own API routes, service layer, and database interactions.

| Module # | Module Name | Primary Users | Core Entities |
|---|---|---|---|
| M01 | Authentication & User Management | Admin, All Users | users, audit_logs |
| M02 | Project Lifecycle Management | Admin, PM | projects, project_users, wbs_tasks, task_dependencies |
| M03 | Budget & Financial Control | PM, Accounts Manager | boq_items, financial_transactions, variation_orders, cpc |
| M04 | Labour Management & Payroll | Supervisor, Accounts Manager | workers, attendance, payroll |
| M05 | Material Procurement & Inventory | Store Keeper, PM | material_master, vendors, mrn, po, grn, inventory |
| M06 | Daily Progress Reporting | Site Engineer, PM | daily_progress_reports, dpr_activities, dpr_manpower, dpr_photos |
| M07 | Document Management | All users (role-filtered) | documents, document_revisions |
| M08 | Safety & Quality Management | Site Engineer, PM | safety_inspections, ncr, safety_incidents |
| M09 | Client Portal | Client | Read from M02, M03, M06 |
| M10 | Reporting & Notification Engine | All (role-filtered) | All tables (read), notifications |

---

## 8.2 Module 1: Authentication & User Management

### 8.2.1 Detailed Description
This module is the foundational security layer of the entire system. It handles user registration (by Admin), login/logout, JWT token issuance and validation, role-based permission enforcement, password management, and account security features (lockout, reset).

The module implements a **stateless authentication model** using JSON Web Tokens (JWT). Upon successful login, the server signs a JWT containing the `userId`, `role`, and `projectIds` (projects the user is assigned to) using a secret key stored in environment variables. This token is returned to the client and stored in memory (React state / secure HTTP-only cookie) and included in the `Authorization: Bearer <token>` header of every subsequent API request.

A custom Express middleware (`authMiddleware`) intercepts all protected routes, verifies the JWT signature, checks expiry, and attaches the decoded user context to `req.user`. A second middleware (`rbacMiddleware`) checks `req.user.role` against the required role for the endpoint and returns HTTP 403 Forbidden if the user lacks permission.

### 8.2.2 Data Structures Used
- **User Object (in-memory, post-authentication):**
```javascript
{
  userId: "uuid-string",
  fullName: "John Doe",
  email: "john@example.com",
  role: "PROJECT_MANAGER",
  projectIds: ["uuid1", "uuid2"],
  iat: 1718000000,
  exp: 1718028800
}
```
- **Permission Matrix (role → allowed routes):** Implemented as a JavaScript object (hash map) for O(1) lookup:
```javascript
const PERMISSIONS = {
  ADMIN: ["*"],
  PROJECT_MANAGER: ["/projects/*", "/wbs/*", "/budget/*", "/dprs/approve", ...],
  SITE_ENGINEER: ["/dprs/create", "/inspections/*", "/tasks/view", ...],
  SUPERVISOR: ["/attendance/*", "/workers/view", ...],
  ...
}
```

### 8.2.3 Process Logic / Algorithm

**Algorithm: User Login**
```
FUNCTION loginUser(email, password):
  1. INPUT: email, password
  2. VALIDATE: email format (regex), password not empty → return 400 if invalid
  3. QUERY: user = SELECT * FROM users WHERE email = $email
  4. IF user is NULL → return 401 "Invalid credentials" (generic message, no email enumeration)
  5. IF user.is_active = FALSE → return 403 "Account deactivated"
  6. IF user.locked_until > NOW() → return 429 "Account locked. Try after [time]"
  7. VERIFY: bcrypt.compare(password, user.password_hash)
  8. IF password INVALID:
       a. INCREMENT user.failed_login_count by 1
       b. IF failed_login_count >= 5:
            SET user.locked_until = NOW() + 30 minutes
            SET user.failed_login_count = 0
       c. UPDATE users SET failed_login_count, locked_until WHERE user_id = user.user_id
       d. RETURN 401 "Invalid credentials"
  9. IF password VALID:
       a. RESET user.failed_login_count = 0, locked_until = NULL
       b. SET user.last_login = NOW()
       c. UPDATE users accordingly
       d. FETCH projectIds = SELECT project_id FROM project_users WHERE user_id = user.user_id
       e. SIGN JWT payload = { userId, role, projectIds } with SECRET, expiry = '8h'
       f. INSERT INTO audit_logs (user_id, action='LOGIN', ip_address, timestamp)
       g. RETURN 200 { token, user: { userId, fullName, email, role } }
```

**Algorithm: RBAC Middleware**
```
FUNCTION rbacCheck(requiredRoles[]):
  1. EXTRACT req.user from request context (set by authMiddleware)
  2. IF req.user is NULL → return 401 Unauthorized
  3. IF req.user.role IN requiredRoles[] OR requiredRoles contains 'ALL' → NEXT()
  4. ELSE → return 403 Forbidden "Insufficient permissions"
  5. FOR project-scoped routes:
       IF req.params.projectId NOT IN req.user.projectIds AND role ≠ ADMIN → return 403
```

---

## 8.3 Module 2: Project Lifecycle Management

### 8.3.1 Detailed Description
This module covers the full project lifecycle: project creation, team assignment, Work Breakdown Structure (WBS) definition, schedule creation with dependencies, real-time progress tracking, and project status management. The Gantt chart is rendered client-side in the React application using the Recharts library and computed WBS data from the API.

### 8.3.2 Data Structures Used
- **WBS Tree:** Stored as an adjacency list in the database (parent_task_id column). Retrieved and reconstructed as a recursive tree structure in the application:
```javascript
// Recursive tree node
WBSNode {
  taskId: UUID,
  taskName: string,
  plannedStart: Date,
  plannedEnd: Date,
  completionPct: number,
  children: WBSNode[],   // recursively nested
  predecessors: WBSNode[]
}
```
- **Dependency Graph:** Directed Acyclic Graph (DAG) maintained in `task_dependencies` table. Critical path calculated using topological sort + forward/backward pass algorithm.

### 8.3.3 Process Logic / Algorithm

**Algorithm: Calculate Project Completion Percentage**
```
FUNCTION calculateProjectCompletion(projectId):
  1. FETCH all root-level tasks WHERE project_id = projectId AND parent_task_id IS NULL
  2. FUNCTION computeNodeCompletion(task):
       a. FETCH children = WBS tasks WHERE parent_task_id = task.task_id
       b. IF children is EMPTY:
            RETURN task.completion_pct * task.weight
       c. ELSE:
            totalWeight = SUM(child.weight for child in children)
            weightedSum = SUM(computeNodeCompletion(child) for child in children)
            RETURN (weightedSum / totalWeight)
  3. totalWeight = SUM(root.weight for root in root tasks)
  4. weightedCompletion = SUM(computeNodeCompletion(root) for root in root tasks)
  5. RETURN ROUND(weightedCompletion / totalWeight, 2)
```

---

## 8.4 Module 3: Budget & Financial Control

### 8.4.1 Detailed Description
This is the most financially critical module. It manages the complete financial lifecycle: BOQ definition and approval, budget allocation by category, recording of all actual expenditures (payments to vendors/contractors, payroll disbursements, petty cash), real-time variance tracking, Earned Value Management (EVM) computation, Variation Order processing, and Contractor Payment Certificate generation.

### 8.4.2 Algorithm: Earned Value Management Computation

```
FUNCTION computeEVM(projectId, asOfDate):
  1. FETCH all WBS tasks for projectId
  2. FETCH total approved budget = SUM(boq_items.total_cost WHERE project_id = projectId AND is_approved = TRUE)
  
  3. // Planned Value (PV): Budget for work scheduled to be done by asOfDate
     plannedPct = 0
     FOR each task IN wbsTasks:
       IF task.planned_end_date <= asOfDate:
         taskPV = (task.planned_cost / totalBudget) * 100  // task's budget contribution
       ELSE IF task.planned_start_date <= asOfDate:
         elapsed = (asOfDate - task.planned_start_date).days
         total = (task.planned_end_date - task.planned_start_date).days
         taskPV = (elapsed / total) * (task.planned_cost / totalBudget) * 100
       ELSE:
         taskPV = 0
     plannedValue = totalBudget * (SUM(taskPV) / 100)

  4. // Earned Value (EV): Budget for work actually completed
     earnedValue = 0
     FOR each task IN wbsTasks:
       earnedValue += (task.completion_pct / 100) * task.planned_cost

  5. // Actual Cost (AC): Total recorded expenditure to date
     actualCost = SELECT SUM(total_amount) FROM financial_transactions
                  WHERE project_id = projectId AND transaction_date <= asOfDate

  6. // Compute Variances
     scheduleVariance = earnedValue - plannedValue      // SV (positive = ahead, negative = behind)
     costVariance = earnedValue - actualCost             // CV (positive = under budget, negative = over)
     spi = earnedValue / plannedValue                    // SPI > 1 = ahead of schedule
     cpi = earnedValue / actualCost                      // CPI > 1 = under budget

  7. RETURN { plannedValue, earnedValue, actualCost, scheduleVariance, costVariance, spi, cpi }
```

---

## 8.5 Module 4: Labour Management & Payroll

### 8.5.1 Algorithm: Monthly Payroll Computation

```
FUNCTION computeMonthlyPayroll(workerId, month, year):
  1. FETCH worker = SELECT * FROM workers WHERE worker_id = workerId
  2. periodStart = first day of (month, year)
  3. periodEnd = last day of (month, year)
  4. FETCH attendanceRecords = SELECT * FROM attendance
       WHERE worker_id = workerId AND date BETWEEN periodStart AND periodEnd

  5. totalDaysPresent = 0
     totalOvertimeHours = 0
     FOR each record IN attendanceRecords:
       IF record.status = 'PRESENT': totalDaysPresent += 1
       IF record.status = 'HALF_DAY': totalDaysPresent += 0.5
       totalOvertimeHours += record.overtime_hours

  6. basicWages = totalDaysPresent * worker.daily_wage_rate
  7. overtimeRate = (worker.daily_wage_rate / 8) * 2  // double rate per hour
  8. overtimeWages = totalOvertimeHours * overtimeRate
  9. grossWages = basicWages + overtimeWages

  10. // Statutory deductions (PF applies if gross > ₹15,000 per month)
      IF grossWages > 15000:
        pfDeduction = grossWages * 0.12   // 12% employee PF
        esiDeduction = grossWages * 0.0075  // 0.75% ESI employee contribution
      ELSE:
        pfDeduction = 0; esiDeduction = 0

  11. totalDeductions = pfDeduction + esiDeduction + otherDeductions
  12. netWages = grossWages - totalDeductions

  13. INSERT INTO payroll (worker_id, project_id, pay_period_start, pay_period_end,
        total_days_present, total_overtime_hours, basic_wages, overtime_wages,
        gross_wages, pf_deduction, esi_deduction, net_wages, payment_status='PENDING')

  14. RETURN payrollRecord
```

---

## 8.6 Module 5: Material Procurement & Inventory

### 8.6.1 Algorithm: Inventory Update on GRN Recording

```
FUNCTION processGRN(grnData, grnItems):
  1. BEGIN TRANSACTION
  2. INSERT INTO goods_receipt_notes (grn fields) → get grn_id
  3. FOR each item IN grnItems:
     a. INSERT INTO grn_items (grn_id, po_item_id, material_id, qty_received,
           qty_accepted, qty_rejected, condition, storage_location)
     b. IF item.condition != 'REJECTED':
           UPDATE inventory
           SET current_stock = current_stock + item.qty_accepted,
               total_received = total_received + item.qty_accepted,
               last_updated = NOW()
           WHERE project_id = grn.project_id AND material_id = item.material_id
           IF no rows updated: (inventory record doesn't exist yet)
             INSERT INTO inventory (project_id, material_id, current_stock=qty_accepted,
                                   total_received=qty_accepted)
     c. UPDATE po_items SET qty_received = qty_received + item.qty_received
           WHERE po_item_id = item.po_item_id
  4. // Check if PO is fully received
     IF SUM(po_items.qty_received) >= SUM(po_items.qty_ordered) FOR all items in PO:
       UPDATE purchase_orders SET status = 'COMPLETED' WHERE po_id = grn.po_id
     ELSE:
       UPDATE purchase_orders SET status = 'PARTIAL_DELIVERY' WHERE po_id = grn.po_id
  5. // Check reorder alerts
     FOR each item IN grnItems:
       currentStock = SELECT current_stock FROM inventory WHERE project_id = ? AND material_id = ?
       reorderLevel = SELECT reorder_level FROM material_master WHERE material_id = ?
       IF currentStock <= reorderLevel:
         TRIGGER alert: notificationService.sendReorderAlert(projectManagerId, materialName, currentStock)
  6. COMMIT TRANSACTION
  7. RETURN { grn_id, updated_inventory_items }
```

---

## 8.7 Implementation Methodology

The project follows the **Agile-Scrum framework** with the following structured phases:

| Phase | Sprint(s) | Deliverables | Agile Ceremony |
|---|---|---|---|
| **Phase 1 — Requirements** | Sprint 0 | SRS document, stakeholder sign-off, user stories backlog, ER diagram | Backlog grooming, sprint planning |
| **Phase 2 — Architecture** | Sprint 0–1 | System architecture diagram, DB schema, API contract (OpenAPI spec), Figma wireframes | Design review |
| **Phase 3 — Backend Core** | Sprint 1–5 | Auth module, Project + WBS APIs, Budget APIs, Labour APIs, Procurement APIs | Sprint review, retrospective |
| **Phase 4 — Backend Extended** | Sprint 6–8 | DPR API, Document management API, Safety + Quality API, Notification engine | Sprint review |
| **Phase 5 — Frontend Core** | Sprint 3–7 | Auth UI, Dashboard, Project management UI, Budget UI, Labour UI | Sprint review, demo |
| **Phase 6 — Frontend Extended** | Sprint 8–11 | Procurement UI, DPR submission, Document UI, Safety UI, Client portal, Reports | Sprint review |
| **Phase 7 — QA & Deployment** | Sprint 12–13 | Unit tests, integration tests, UAT, performance test, production deployment | Release planning |

**Sprint Cadence:**
- Sprint Duration: 2 weeks
- Daily Standup: 15 minutes (async text update for this solo project)
- Sprint Review: Demo of working features
- Sprint Retrospective: Lessons learned and process adjustments
- Definition of Done: Feature implemented, tested, code reviewed (self-review), API documented in Postman

---

## 8.8 List of Reports Generated

### Report 1: Project Progress Summary Report

| Column | Description |
|---|---|
| Project Name & Code | Identification |
| Contract Value (₹) | Approved amount |
| Start Date / Planned End | Schedule reference |
| Current Status | Lifecycle stage |
| Overall Completion % | Weighted WBS completion |
| Tasks Completed / Total | Count summary |
| Schedule Status | ON_TRACK / DELAYED / CRITICAL |
| Budget Utilized (%) | Actual vs. Approved |
| SPI / CPI | EVM health indicators |
| Last DPR Date | Latest reporting date |

### Report 2: Budget Variance Report

| Column | Description |
|---|---|
| Cost Category | Civil/Structural/MEP/Finishing/etc. |
| Approved Budget (₹) | BOQ total per category |
| Committed Cost (₹) | Approved POs + Contracts |
| Actual Expenditure (₹) | Paid amounts |
| Balance (₹) | Budget - Actual |
| Variance % | ((Actual - Budget) / Budget) × 100 |
| Status | WITHIN BUDGET / OVERRUN |

### Report 3: Labour Productivity & Payroll Register

| Column | Description |
|---|---|
| Worker Name | Full name |
| Trade Category | Skill classification |
| Days Present / Absent | Attendance count |
| Overtime Hours | Total OT |
| Basic Wages (₹) | Days × Rate |
| OT Wages (₹) | OT calculation |
| Gross Wages (₹) | Total earnings |
| PF Deduction (₹) | Statutory deduction |
| ESI Deduction (₹) | Statutory deduction |
| Net Wages (₹) | Take-home pay |

### Report 4: Material Consumption & Inventory Report

| Column | Description |
|---|---|
| Material Code & Name | Identity |
| Unit | UOM |
| Opening Stock | Start of period |
| Received (GRN) | New receipts |
| Issued | Materials consumed |
| Closing Stock | Current inventory |
| Reorder Level | Alert threshold |
| Status | ADEQUATE / BELOW REORDER / STOCKOUT |

### Report 5: Safety Incident Summary Report

| Column | Description |
|---|---|
| Incident Date | Date of occurrence |
| Type | Near-miss / Injury / Fatality |
| Location | Site area/floor |
| Personnel Involved | Names/count |
| Description | Brief description |
| Immediate Action | Response taken |
| Investigation Status | PENDING / UNDER INVESTIGATION / CLOSED |
| Corrective Action | Preventive measure |

### Report 6: NCR Status Report

| Column | Description |
|---|---|
| NCR Number | Reference |
| Type | Safety/Quality |
| Severity | Minor/Major/Critical |
| Description | Non-conformance detail |
| Raised Date | Date created |
| Assigned To | Responsible person |
| Due Date | Closure deadline |
| Status | OPEN / IN_PROGRESS / CLOSED / OVERDUE |
| Days Overdue | If applicable |

### Report 7: Vendor Performance Report

| Column | Description |
|---|---|
| Vendor Name & Code | Identity |
| Total POs Issued | Count |
| Total PO Value (₹) | Aggregate value |
| On-Time Deliveries (%) | Delivery performance |
| Rejection Rate (%) | Quality performance |
| Average Rating | 0–5 stars |
| Outstanding Payments (₹) | Pending dues |

### Report 8: Client Progress Certificate

| Column | Description |
|---|---|
| Project Details | Name, code, contract value |
| Reporting Period | Month/quarter |
| Milestones Achieved | List with dates |
| Work Completion % | As certified by PM |
| Financial Statement | Billed / Received / Retention |
| Upcoming Milestones | Next month targets |
| Photographs | Site progress photos |

---
# MCSP-232 Synopsis — Part 4
## Construction Management System

---

# SECTION 9: OVERALL NETWORK ARCHITECTURE

## 9.1 Architectural Overview

The Construction Management System is built on a **three-tier client-server architecture** deployed in a cloud environment, with the application structured as a **RESTful monolith** (designed for future microservices decomposition). The architecture separates concerns into: **Presentation Tier** (React.js SPA), **Application Tier** (Node.js/Express.js REST API), and **Data Tier** (PostgreSQL + Redis).

The deployment topology supports geographically distributed users — head office staff on desktops, site engineers on tablets/smartphones, and the server infrastructure hosted on a cloud provider (AWS/DigitalOcean/Hetzner).

---

## 9.2 Detailed Architecture Layers

### 9.2.1 Layer 1 — Client Tier (Presentation)

**Components:**
- **React.js Single Page Application (SPA):** The frontend is a compiled static bundle (HTML, CSS, JS) served by Nginx. It runs entirely in the user's browser, communicating with the backend exclusively through HTTP/HTTPS REST API calls.
- **Browser Storage:** JWT tokens are stored in memory (React state) or in `httpOnly` secure cookies to prevent XSS-based token theft. Local Storage is avoided for sensitive tokens.
- **State Management:** React Query (TanStack Query) manages server state with intelligent caching, background refetching, and stale-while-revalidate patterns — reducing redundant API calls significantly.
- **Service Worker (Future):** Planned as a PWA enhancement for offline DPR drafting and background sync.

**Client Types:**
| Client Type | Device | Connection | Primary Use |
|---|---|---|---|
| Admin / PM | Desktop/Laptop | Office broadband (100 Mbps) | Full system management |
| Accounts Manager | Desktop | Office broadband | Financial modules |
| Site Engineer | Tablet / Laptop | 4G/LTE or site Wi-Fi | DPR, inspections, documents |
| Supervisor | Smartphone | 4G/LTE | Labour attendance |
| Store Keeper | Tablet/Desktop | Site Wi-Fi | Inventory, GRN |
| Client | Any device | Home/office broadband | Read-only portal |

---

### 9.2.2 Layer 2 — Network & Security Perimeter

**Components:**
- **DNS Resolution:** Domain resolves to the cloud server's public IP via A record (e.g., `cms.constructionerp.in → 203.0.113.10`).
- **SSL/TLS Termination:** All traffic is served over HTTPS (TLS 1.3). SSL certificates are obtained via Let's Encrypt (Certbot) and auto-renewed every 90 days.
- **Nginx Reverse Proxy:** Acts as the entry point for all incoming HTTP/HTTPS traffic. Functions:
  - Terminates SSL connections.
  - Serves the static React build from `/var/www/cms/dist`.
  - Proxies API requests (`/api/v1/*`) to the Node.js application server on port 5000.
  - Serves uploaded files from the `/uploads` directory.
  - Implements gzip compression for all text responses.
  - Sets security headers (HSTS, X-Frame-Options, X-Content-Type-Options).
  - Implements connection rate limiting (100 requests/minute per IP).
- **Firewall (UFW/iptables):** Only ports 80 (HTTP redirect), 443 (HTTPS), and 22 (SSH, restricted to admin IPs) are open. Port 5000 (Node.js), 5432 (PostgreSQL), and 6379 (Redis) are bound to `localhost` only — never exposed to the public internet.

---

### 9.2.3 Layer 3 — Application Tier

**Components:**
- **Node.js / Express.js API Server:** The core business logic layer. Runs as a clustered process under PM2, utilizing all available CPU cores for parallel request processing.
- **PM2 Process Manager:** Manages the Node.js application cluster. Provides:
  - Automatic restart on crash (with exponential backoff).
  - Load distribution across CPU cores (`cluster mode`).
  - Log rotation and monitoring.
  - Zero-downtime deployments (`pm2 reload`).
- **API Route Structure:**
```
/api/v1/
  ├── /auth          → Authentication routes
  ├── /users         → User management
  ├── /projects      → Project CRUD + status
  ├── /wbs           → WBS tasks + dependencies
  ├── /budget        → BOQ + financial transactions
  ├── /labour        → Workers + attendance + payroll
  ├── /procurement   → MRN + PO + GRN + inventory
  ├── /dprs          → Daily progress reports
  ├── /documents     → Document management
  ├── /safety        → Inspections + NCR + incidents
  ├── /clients       → Client portal endpoints
  ├── /reports       → Report generation endpoints
  └── /notifications → Notification management
```
- **Middleware Stack (per request):**
  1. `helmet()` — Sets security headers
  2. `cors()` — Validates Origin header
  3. `express-rate-limit` — Rate limiting
  4. `compression()` — Gzip response
  5. `morgan()` — HTTP request logging
  6. `express.json()` — Parse JSON body
  7. `authMiddleware` — Verify JWT
  8. `rbacMiddleware` — Check permissions
  9. Route Handler (Controller)
  10. Error Handler Middleware

- **Redis Cache Layer:** Used for:
  - Caching dashboard aggregate queries (TTL: 5 minutes) to avoid repeated expensive SQL joins.
  - Storing rate limit counters (IP-based).
  - Storing password reset tokens (TTL: 15 minutes).
  - Pub/Sub for real-time notifications (planned).

- **File Upload Service:** Multer handles multipart/form-data uploads. Files are stored on the server filesystem (or Cloudinary for cloud object storage). Sharp compresses images to < 500KB before saving.

- **Email Notification Service:** Nodemailer connects to SendGrid SMTP (or Gmail SMTP for development) to dispatch transactional emails for: login alerts, budget threshold alerts, DPR approval status, task deadlines, and NCR assignments.

---

### 9.2.4 Layer 4 — Data Tier

**Components:**
- **PostgreSQL 15 Database Server:**
  - Primary relational data store for all persistent application data.
  - Runs on the same server (single-server deployment) or on a dedicated RDS instance (cloud deployment).
  - Configured with Write-Ahead Logging (WAL) for crash recovery.
  - Connection pooling via `pg-pool` in the Node.js application (max 10 connections).
  - Automated vacuuming and statistics collection enabled.
  - **Backup Strategy:** `pg_dump` daily at 2:00 AM UTC, stored for 30 days. Weekly full backup stored for 90 days.

- **Redis 7 In-Memory Store:**
  - Key-value store for caching and session management.
  - Persistence enabled via RDB snapshots (every 1 hour) for resilience.
  - Max memory set to 512 MB with LRU eviction policy.

- **File Storage:**
  - `/uploads/` directory on the server filesystem, organized as:
    ```
    /uploads/
      /documents/{project_id}/{document_id}/
      /dprs/{project_id}/{date}/{dpr_id}/
      /workers/{worker_id}/
      /profiles/{user_id}/
    ```
  - Nginx serves files directly from this directory with access control enforced by the application layer (pre-signed URL pattern or API-proxied download).

---

### 9.2.5 Network Topology Diagram — Textual Description

```
[INTERNET]
    │
    │ HTTPS (443) / HTTP (80 → redirect)
    ▼
┌─────────────────────────────────────────────────────────┐
│                    CLOUD SERVER (Ubuntu 22.04)          │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │              NGINX (Port 80/443)                │   │
│  │  • SSL Termination (TLS 1.3 / Let's Encrypt)   │   │
│  │  • Static React Build (/var/www/cms/dist)       │   │
│  │  • Reverse Proxy → localhost:5000 for /api/*   │   │
│  │  • Static Files → /uploads/* directory          │   │
│  │  • Rate Limiting, Gzip, Security Headers        │   │
│  └────────────────────┬────────────────────────────┘   │
│                       │ proxy_pass localhost:5000       │
│  ┌────────────────────▼────────────────────────────┐   │
│  │         NODE.JS / EXPRESS API SERVER            │   │
│  │         (PM2 Cluster, Port 5000)                │   │
│  │                                                 │   │
│  │  ┌─────────┐ ┌──────────┐ ┌─────────────────┐ │   │
│  │  │Auth Mod.│ │Project M.│ │Budget Module    │ │   │
│  │  └─────────┘ └──────────┘ └─────────────────┘ │   │
│  │  ┌─────────┐ ┌──────────┐ ┌─────────────────┐ │   │
│  │  │Labour M.│ │Procure M.│ │DPR Module       │ │   │
│  │  └─────────┘ └──────────┘ └─────────────────┘ │   │
│  │  ┌─────────┐ ┌──────────┐ ┌─────────────────┐ │   │
│  │  │Document │ │Safety M. │ │Notification Eng.│ │   │
│  │  └─────────┘ └──────────┘ └─────────────────┘ │   │
│  └──────────────┬─────────────────┬───────────────┘   │
│                 │ Prisma ORM       │ ioredis            │
│  ┌──────────────▼──────┐  ┌───────▼────────────────┐  │
│  │  PostgreSQL 15       │  │     Redis 7             │  │
│  │  (Port 5432,         │  │  (Port 6379,            │  │
│  │   localhost only)    │  │   localhost only)       │  │
│  └──────────────────────┘  └────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │    /uploads/ File Storage (Nginx-served)         │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                       │
              ┌────────▼────────┐
              │  SendGrid SMTP  │   (External Email Service)
              └─────────────────┘

CLIENT ACCESS PATTERNS:
Desktop/Laptop ──── Office LAN ──── Internet ──── HTTPS → Nginx
Tablet/Phone ──── 4G/LTE / Wi-Fi ──── Internet ──── HTTPS → Nginx
```

### 9.2.6 API Communication Pattern

All client-server communication follows a consistent **RESTful JSON API** pattern:

| Method | Pattern | Use Case |
|---|---|---|
| GET | `/api/v1/{resource}` | List all resources (with pagination, filtering) |
| GET | `/api/v1/{resource}/{id}` | Fetch single resource |
| POST | `/api/v1/{resource}` | Create new resource |
| PATCH | `/api/v1/{resource}/{id}` | Partial update of resource |
| PUT | `/api/v1/{resource}/{id}` | Full replacement of resource |
| DELETE | `/api/v1/{resource}/{id}` | Delete resource (soft delete preferred) |

**Standard API Response Format:**
```json
// Success Response
{
  "success": true,
  "data": { /* resource object or array */ },
  "meta": { "total": 150, "page": 1, "limit": 20, "totalPages": 8 },
  "message": "Projects retrieved successfully"
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "contract_value must be a positive number",
    "details": [{ "field": "contract_value", "issue": "must be > 0" }]
  }
}
```

---

# SECTION 10: SECURITY MECHANISMS

## 10.1 Security Architecture Overview

Security is implemented at **five distinct layers** in the CMS architecture: Network Level, Transport Level, Application Level, Authentication/Authorization Level, and Database Level. This defense-in-depth approach ensures that a breach at one layer does not automatically compromise the entire system.

---

## 10.2 Network-Level Security

| Mechanism | Implementation | Purpose |
|---|---|---|
| **Firewall** | UFW configured to allow only ports 22, 80, 443; all other ports DENY | Reduces attack surface |
| **SSH Hardening** | SSH on port 22 restricted to specific admin IP ranges; password authentication disabled; key-based auth only | Prevents brute-force SSH attacks |
| **Fail2Ban** | Automatically bans IPs with >5 failed SSH attempts within 10 minutes (30-minute ban) | Brute-force protection |
| **DDoS Mitigation** | Nginx `limit_req_zone` rate limiting (100 req/min per IP); Cloudflare CDN layer (optional) | Mitigates volumetric attacks |

---

## 10.3 Transport-Level Security

| Mechanism | Implementation | Purpose |
|---|---|---|
| **TLS 1.3** | Nginx configured with `ssl_protocols TLSv1.2 TLSv1.3` (TLS 1.0 and 1.1 disabled) | Encrypted data-in-transit |
| **HSTS** | `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` | Forces HTTPS, prevents downgrade attacks |
| **HTTP → HTTPS Redirect** | Nginx 301 redirect from port 80 to 443 | Prevents accidental plaintext transmission |
| **Certificate Management** | Let's Encrypt via Certbot; auto-renewal cron job | Prevents expired certificate errors |
| **TLS Cipher Suites** | Only strong ciphers enabled: ECDHE-RSA-AES256-GCM-SHA384, etc. Weak ciphers (RC4, DES, 3DES) disabled | Prevents cipher-level attacks |

---

## 10.4 Application-Level Security

### 10.4.1 Security HTTP Headers (via Helmet.js)

| Header | Value | Purpose |
|---|---|---|
| `Content-Security-Policy` | `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'` | Prevents XSS by restricting resource origins |
| `X-Frame-Options` | `DENY` | Prevents clickjacking attacks |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME-type sniffing attacks |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Controls referrer information leakage |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Disables unused browser APIs |
| `X-XSS-Protection` | `1; mode=block` (legacy browsers) | Browser-level XSS filter |

### 10.4.2 Input Validation and Sanitization

All user-supplied input is validated at two levels:

**Client-Side (React + Zod):**
- Zod schemas define the expected shape and constraints for every form.
- Invalid data is rejected before submission with user-friendly error messages.
- Example: `contract_value` must be `z.number().positive().max(9999999999.99)`.

**Server-Side (Joi validation middleware):**
- Every API endpoint has a Joi validation schema applied before the controller runs.
- If validation fails, the request is rejected with HTTP 400 and detailed field-level errors.
- Server-side validation is the authoritative check — client-side is convenience only.
- All string inputs are trimmed; HTML tags are stripped to prevent stored XSS.
- Email inputs are normalized to lowercase.

### 10.4.3 SQL Injection Prevention

The system uses **Prisma ORM** for all database interactions. Prisma uses **parameterized queries** exclusively — user input is never interpolated into SQL strings. For example:

```javascript
// SAFE (Prisma - parameterized):
const user = await prisma.user.findUnique({
  where: { email: userInput }  // userInput is NEVER concatenated into SQL
});

// Prisma generates: SELECT * FROM users WHERE email = $1
// with userInput passed as the $1 parameter — SQL injection impossible.
```

Raw SQL queries are only used in exceptional cases (complex aggregations) and always use `prisma.$queryRaw` with tagged template literals, which also enforce parameterization:
```javascript
const result = await prisma.$queryRaw`
  SELECT project_id, SUM(total_amount) as total
  FROM financial_transactions
  WHERE project_id = ${projectId}  -- parameterized, safe
  GROUP BY project_id
`;
```

### 10.4.4 Cross-Site Request Forgery (CSRF) Prevention

Since the API uses **JWT in Authorization headers** (not cookies for API calls), CSRF attacks are inherently mitigated — CSRF exploits the browser's automatic cookie sending, which does not apply to Authorization header tokens. For any form that uses cookie-based sessions (admin panel), a synchronizer token pattern (CSRF token in hidden form field) is implemented.

### 10.4.5 Cross-Site Scripting (XSS) Prevention

- **Stored XSS:** All user-supplied text is stripped of HTML tags on the server before storage using the `sanitize-html` library.
- **Reflected XSS:** React's JSX rendering escapes all dynamic content by default (React DOM escapes before rendering).
- **DOM-based XSS:** `innerHTML` is never used; only `textContent` and React's `{variable}` interpolation.
- **Content Security Policy:** The strict CSP header (see above) prevents execution of any inline scripts or scripts from unauthorized origins.

### 10.4.6 API Rate Limiting

```javascript
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // 100 requests per window per IP
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({ client: redisClient })  // Redis-backed counter
});

// Stricter limit for authentication endpoints (brute-force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,  // Only 10 login attempts per 15 minutes per IP
  skipSuccessfulRequests: true
});

app.use('/api/v1/', rateLimiter);
app.use('/api/v1/auth/login', authLimiter);
```

### 10.4.7 File Upload Security

- **File Type Validation:** Multer's `fileFilter` checks the file's MIME type against an allowlist (`image/jpeg`, `image/png`, `application/pdf`, `application/vnd.ms-excel`, etc.). The MIME type is verified from the file content (using `file-type` library), not just the filename extension.
- **File Size Limits:** Maximum 50 MB per file, enforced by Multer's `limits` option.
- **Filename Sanitization:** Original filenames are discarded. Files are saved with a UUID-based name to prevent path traversal attacks: `{uuid}.{extension}`.
- **Storage Outside Web Root:** Uploaded files are stored outside the Nginx web root where possible, served through the API with access control checks, preventing direct URL guessing attacks.
- **Virus Scanning (Future):** Integration with ClamAV for malware scanning of uploaded files is planned.

### 10.4.8 CORS (Cross-Origin Resource Sharing) Configuration

```javascript
const corsOptions = {
  origin: [
    'https://cms.constructionerp.in',   // Production domain
    'http://localhost:5173'              // Development (Vite dev server)
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400  // Cache preflight for 24 hours
};
app.use(cors(corsOptions));
```

---

## 10.5 Authentication & Authorization Security

### 10.5.1 JWT Security Implementation

```javascript
// Token generation (login)
const token = jwt.sign(
  { userId, role, projectIds },
  process.env.JWT_SECRET,           // 256-bit random secret from .env
  {
    expiresIn: '8h',                // 8-hour expiry
    issuer: 'cms-api',
    audience: 'cms-client',
    algorithm: 'HS256'
  }
);

// Token verification (middleware)
const decoded = jwt.verify(token, process.env.JWT_SECRET, {
  issuer: 'cms-api',
  audience: 'cms-client',
  algorithms: ['HS256']
});
// If verification fails (invalid signature, expired, wrong issuer) → throws → 401
```

**JWT Best Practices Applied:**
- Algorithm is explicitly specified (`HS256`) — prevents the "none" algorithm attack.
- Short expiry (8 hours) limits the window for token misuse.
- `JWT_SECRET` is a cryptographically random 256-bit string stored in `.env` (never hardcoded).
- Refresh token mechanism: a long-lived (7-day) refresh token stored as an `httpOnly` cookie allows silent token renewal without re-login.

### 10.5.2 Password Security

```javascript
// Password hashing (user creation / password change)
const BCRYPT_ROUNDS = 12;  // 2^12 iterations
const hash = await bcrypt.hash(plainTextPassword, BCRYPT_ROUNDS);

// Password verification (login)
const isValid = await bcrypt.compare(plainTextPassword, storedHash);
```

- Cost factor of 12 means bcrypt performs 4,096 iterations — each hash takes ~250ms on modern hardware, making brute-force impractical.
- Bcrypt inherently incorporates a cryptographic salt per hash — no rainbow table attacks.
- Password complexity is enforced: minimum 8 characters, uppercase, digit, special character.
- **Timing attack prevention:** `bcrypt.compare()` uses constant-time comparison internally.

### 10.5.3 Role-Based Access Control (RBAC) Matrix

| Resource | ADMIN | PROJECT_MGR | SITE_ENG | SUPERVISOR | ACCOUNTS | STORE_KEEPER | CLIENT |
|---|---|---|---|---|---|---|---|
| User Management | CRUD | — | — | — | — | — | — |
| Project (Create/Delete) | CRUD | CR | R | R | R | R | R |
| WBS Tasks | CRUD | CRUD | R, Update% | R | R | R | R |
| BOQ / Budget | CRUD | CRUD | R | — | R | — | R(partial) |
| Financial Transactions | R | R,A | — | — | CRUD | — | R(summary) |
| Workers | CRUD | R | R | R | R | — | — |
| Attendance | CRUD | R | R | CRU | R | — | — |
| Payroll | R | R,A | — | — | CRUD | — | — |
| MRN | R | R,A | — | — | R | CRU | — |
| Purchase Orders | R | R,A | — | — | R | R | — |
| GRN | R | R | — | — | R | CRUD | — |
| DPR | R | R,A | CRUD | R | R | — | R |
| Documents | CRUD | CRUD | CRU | R | R | R | R(approved) |
| Safety Inspections | R | R | CRUD | R | — | — | — |
| NCR | R | R,A | CRUD | R | — | — | — |
| Client Queries | R | R,A | R | — | — | — | CRU |
| Reports | R | R | R(limited) | R(limited) | R | R(limited) | R(limited) |

**Legend:** C=Create, R=Read, U=Update, D=Delete, A=Approve, —=No Access

---

## 10.6 Database-Level Security

| Mechanism | Implementation | Purpose |
|---|---|---|
| **Least Privilege DB User** | Application uses a PostgreSQL role with only SELECT/INSERT/UPDATE/DELETE on application tables; no DROP/CREATE/ALTER privileges | Limits damage from SQL injection |
| **Connection Encryption** | `ssl: true` in Prisma connection config; PostgreSQL configured to require SSL connections | Encrypts DB traffic |
| **Password in ENV** | Database URL in `.env` file, excluded from `.gitignore`, never committed to version control | Prevents credential exposure |
| **Audit Logging** | All CREATE/UPDATE/DELETE operations write to `audit_logs` table before commit | Forensic traceability |
| **Soft Deletes** | Critical records (projects, users, workers) use `is_active = FALSE` instead of physical DELETE | Prevents accidental data loss, maintains audit trail |
| **Backup Encryption** | `pg_dump` backups compressed and encrypted with GPG before off-site transfer | Protects backup data at rest |
| **Connection Pooling Limits** | Max 10 connections in pool; protects against connection exhaustion DoS | Availability protection |

---

## 10.7 Data Privacy and Compliance

- **Sensitive Data Masking:** Worker ID proof numbers (Aadhaar, PAN) are masked in API responses for non-admin roles (e.g., `XXXX-XXXX-1234`).
- **Bank Account Security:** Bank account numbers are stored encrypted using AES-256 at the application layer; only the last 4 digits are displayed in UI.
- **Data Retention Policy:** Projects are archived (read-only) after closure; data is retained for a minimum of 7 years to comply with Indian financial record-keeping requirements.
- **Access Logging:** All data access is logged in `audit_logs` with user ID and timestamp, providing a complete access audit trail for compliance purposes.

---

# SECTION 11: FUTURE SCOPE AND FURTHER ENHANCEMENTS

## 11.1 Planned Enhancements (Version 2.0)

### 11.1.1 Building Information Modelling (BIM) Integration
The most transformative future enhancement is integration with BIM platforms (Autodesk Revit, IFC-format viewers). This would allow:
- 3D model visualization directly in the browser using technologies like **Three.js** or **Autodesk Forge Viewer**.
- Linking WBS tasks directly to building elements in the 3D model ("model-based scheduling").
- Clash detection integration to identify conflicts between structural, architectural, and MEP designs before construction.
- 4D BIM (3D model + time) showing the building's construction progress visually.

### 11.1.2 Native Mobile Applications (iOS & Android)
Development of dedicated native mobile applications using **React Native** for:
- **Offline capability:** Site engineers can fill DPRs offline; data syncs when connectivity is restored.
- **Push notifications:** Real-time push alerts for approvals, deadlines, and safety incidents.
- **Camera integration:** Direct photo capture from the device camera with GPS geotag and timestamp embedded in EXIF data.
- **Biometric attendance:** Integration with on-site biometric devices (fingerprint/face recognition) for tamper-proof attendance.

### 11.1.3 AI/ML-Based Predictive Analytics
Integration of a machine learning module to:
- **Cost Overrun Prediction:** Train a regression model on historical project data (BOQ variance, SPI, CPI trends) to predict the final cost overrun probability at any stage of the project.
- **Schedule Delay Prediction:** Classify projects as at-risk of delay based on weather patterns, manpower trends, and current SPI.
- **Material Consumption Forecasting:** Use time-series forecasting (ARIMA/Prophet) to predict material demand for the next 30 days, enabling proactive procurement.
- **Safety Incident Prediction:** Analyze patterns in near-miss incidents and safety inspection failures to predict high-risk periods, enabling preventive interventions.

### 11.1.4 ERP and Accounting Integration
- **Tally ERP Integration:** Bi-directional API integration with Tally ERP to sync financial transactions, vendor payments, and payroll data — eliminating double data entry.
- **GST Portal Integration:** Automatic generation and submission of GSTR-1 and GSTR-3B returns for construction-related purchases using the GST API.
- **E-Invoice Integration:** Integration with the Invoice Registration Portal (IRP) for real-time e-invoice generation as mandated by CBIC for applicable turnovers.

### 11.1.5 IoT and Smart Site Integration
- **Equipment Tracking:** GPS trackers on heavy equipment (cranes, JCBs, dumpers) integrated with the CMS to track location, operating hours, and fuel consumption.
- **Environmental Monitoring:** IoT sensors for noise level, dust concentration (PM10/PM2.5), and temperature on construction sites — feeding real-time data into the safety module.
- **Automated Concrete Curing Monitoring:** Temperature and moisture sensors in concrete pours, with data feeding directly into the quality inspection module.
- **Smart Attendance:** RFID or NFC card-based attendance at site entry/exit gates, with automatic sync to the attendance module.

### 11.1.6 E-Tendering and Contractor Bidding Portal
A dedicated module for online tendering:
- Digital Notice Inviting Tender (NIT) publication.
- Contractor registration and pre-qualification.
- Online Bill of Quantities download.
- Encrypted bid submission with bid validity tracking.
- Automated comparative statement (L1 analysis).
- Award of Work Order generation.

### 11.1.7 Client-Facing Augmented Reality (AR) Progress Visualization
Using WebXR APIs:
- Clients can use their smartphone to overlay the planned 3D building model on the actual construction site, seeing what the finished building will look like from any angle.
- Milestone achievement photos overlaid on the 3D model with completion dates.
- Virtual site tour generation from aggregated DPR photographs.

### 11.1.8 Advanced Reporting and Business Intelligence
- Integration with **Apache Superset** or **Metabase** (open-source BI tools) for self-service ad-hoc reporting and interactive dashboards beyond the predefined report set.
- **Automated Executive Reports:** Scheduled daily/weekly PDF reports emailed to senior management with key project health metrics, without manual intervention.
- **Portfolio Analytics:** For organizations managing 20+ projects simultaneously, a portfolio-level dashboard showing overall resource utilization, budget health across all projects, and risk heat map.

### 11.1.9 Multi-Language Support
- Hindi (देवनागरी) interface for site-level users (supervisors, store keepers) using `react-i18next`.
- Regional language support (Tamil, Telugu, Marathi, Kannada) for broader adoption in respective state-level government infrastructure projects.

### 11.1.10 Blockchain for Contract and Payment Transparency
- Recording key project milestones, payment certificates, and variation order approvals on a permissioned blockchain (Hyperledger Fabric).
- Smart contracts for automatic release of retention money when specified conditions (final inspection pass, defect liability period end) are digitally verified.
- Immutable audit trail for dispute resolution in high-value contracts.

---

## 11.2 Research and Academic Extensions

| Extension | Research Area |
|---|---|
| Computer Vision for Quality Inspection | CNN-based models detecting concrete cracks or rebar spacing defects from site photographs |
| NLP for DPR Analysis | Extracting structured insights from free-text DPR remarks using Named Entity Recognition |
| Optimization of Resource Allocation | Genetic algorithm or linear programming for multi-project resource leveling |
| Digital Twin Integration | Real-time synchronization between physical site sensors and a digital 3D model |

---

# SECTION 12: BIBLIOGRAPHY

The following references were consulted in the research, design, and development of the Construction Management System project synopsis.

---

**[1]** Sommerville, I. (2016). *Software Engineering* (10th ed.). Pearson Education Limited. ISBN: 978-0-13-394303-0.
*(Referenced for software engineering principles, requirements engineering, and SDLC methodologies used in this project.)*

---

**[2]** Pressman, R. S., & Maxim, B. R. (2020). *Software Engineering: A Practitioner's Approach* (9th ed.). McGraw-Hill Education. ISBN: 978-1-259-87220-0.
*(Referenced for SRS documentation structure, analysis and design models (DFD, UML), and project planning techniques.)*

---

**[3]** Elmasri, R., & Navathe, S. B. (2015). *Fundamentals of Database Systems* (7th ed.). Pearson Education. ISBN: 978-0-13-397077-7.
*(Referenced for relational database design, ER modelling, normalization theory (1NF, 2NF, 3NF), and indexing strategies.)*

---

**[4]** Fowler, M. (2002). *Patterns of Enterprise Application Architecture*. Addison-Wesley Professional. ISBN: 978-0-32-112521-7.
*(Referenced for MVC architectural pattern, Repository pattern, and Service Layer pattern used in the CMS backend design.)*

---

**[5]** OWASP Foundation. (2021). *OWASP Top 10: 2021 — The Ten Most Critical Web Application Security Risks*. Open Web Application Security Project. Retrieved from https://owasp.org/www-project-top-ten/
*(Referenced for application security design — SQL Injection (A03), XSS (A07), Broken Authentication (A07:2017), and CSRF prevention mechanisms.)*

---

**[6]** Watt, A., & Eng, N. (2014). *Database Design* (2nd ed.). BCcampus Open Education. ISBN: 978-1-77420-025-2.
*(Referenced for relational database normalization, schema design patterns, and entity-relationship modelling.)*

---

**[7]** Project Management Institute. (2021). *A Guide to the Project Management Body of Knowledge (PMBOK® Guide)* (7th ed.). PMI. ISBN: 978-1-62825-664-2.
*(Referenced for Earned Value Management (EVM) formulas — PV, EV, AC, SPI, CPI — and project scheduling concepts (WBS, critical path method) used in the Budget and Project modules.)*

---

**[8]** Kerzner, H. (2017). *Project Management: A Systems Approach to Planning, Scheduling, and Controlling* (12th ed.). John Wiley & Sons. ISBN: 978-1-119-16535-4.
*(Referenced for Gantt chart and PERT chart construction, project scheduling methodologies, and risk management frameworks.)*

---

**[9]** Flanagan, D. (2020). *JavaScript: The Definitive Guide* (7th ed.). O'Reilly Media. ISBN: 978-1-491-95226-3.
*(Referenced for JavaScript language concepts, async/await patterns, and Node.js development practices used in the backend implementation.)*

---

**[10]** Aceto, G., Persico, V., & Pescapé, A. (2019). Industry 4.0 and Health: Internet of Things, Big Data, and Cloud Computing for Healthcare 4.0. *Journal of Industrial Information Integration*, 18, 100129. https://doi.org/10.1016/j.jii.2020.100129
*(Referenced for IoT integration concepts applicable to the smart site future scope section.)*

---

**[11]** Azhar, S. (2011). Building Information Modeling (BIM): Trends, Benefits, Risks, and Challenges for the AEC Industry. *Leadership and Management in Engineering*, 11(3), 241–252. https://doi.org/10.1061/(ASCE)LM.1943-5630.0000127
*(Referenced for BIM integration concepts and the construction industry's digital transformation context.)*

---

**[12]** Eastman, C., Teicholz, P., Sacks, R., & Liston, K. (2011). *BIM Handbook: A Guide to Building Information Modeling for Owners, Designers, Engineers, Contractors, and Facility Managers* (2nd ed.). John Wiley & Sons. ISBN: 978-0-470-54137-1.
*(Referenced for BIM concepts included in the future scope section.)*

---

**[13]** Wang, J., Zhang, W., Shi, Y., Duan, S., & Liu, J. (2018). Industrial Grade Category-level Object Recognition: A Multi-Modal Learning Approach. *IEEE Access*, 7, 46965–46974. https://doi.org/10.1109/ACCESS.2018.2885435
*(Referenced for computer vision applications in construction quality inspection — future scope AI module.)*

---

**[14]** Moshood, T. D., Nawanir, G., Mahmud, F., Mohamad, F., Ahmad, M. H., & AbdulGhani, A. (2021). Digitalization of Construction Industry for Realizing Construction 4.0: A Study in the Malaysian Construction Industry. *Ain Shams Engineering Journal*, 12(4), 3993–4000. https://doi.org/10.1016/j.asej.2021.02.030
*(Referenced for the construction industry digitalization gap analysis and motivation for the proposed CMS.)*

---

**[15]** Love, P. E. D., & Skitmore, M. (1996). Approaches to Organisational Effectiveness and Their Application to Construction Project Organisations. *Engineering Construction and Architectural Management*, 3(3), 133–154. https://doi.org/10.1108/eb021030
*(Referenced for construction project management organizational structure and the multi-stakeholder access control model.)*

---

**[16]** Richardson, L. (2008). *RESTful Web Services*. O'Reilly Media. ISBN: 978-0-596-52926-0.
*(Referenced for REST API design principles, HTTP method semantics, and resource naming conventions used in the CMS API design.)*

---

**[17]** Indian Standard IS 7969:1976. *Safety Code for Handling and Storage of Building Materials*. Bureau of Indian Standards, New Delhi.
*(Referenced for the safety inspection checklist items included in the Safety & Quality Management module.)*

---

**[18]** McKinsey Global Institute. (2017). *Reinventing Construction: A Route to Higher Productivity*. McKinsey & Company.
*(Referenced for the construction industry productivity statistics cited in the project introduction — 20% schedule overrun and 80% cost overrun data.)*

---

---

# APPENDIX A: TECHNOLOGY STACK SUMMARY

| Layer | Technology | Version | Role |
|---|---|---|---|
| Frontend | React.js | 18.2 | UI Framework |
| Frontend | Tailwind CSS | 3.4 | Styling |
| Frontend | React Query | 5.x | Server State Management |
| Frontend | Recharts | 2.x | Dashboard Charts |
| Backend | Node.js | 20 LTS | Runtime |
| Backend | Express.js | 4.x | Web Framework |
| Backend | Prisma ORM | 5.x | Database Access |
| Auth | JSON Web Token | 9.x | Stateless Auth |
| Auth | bcryptjs | 2.4 | Password Hashing |
| Database | PostgreSQL | 15 | Primary RDBMS |
| Cache | Redis | 7.x | Caching + Rate Limit |
| Server | Nginx | 1.24 | Reverse Proxy / SSL |
| Process Mgr | PM2 | 5.x | Node.js Clustering |
| Container | Docker | 24.x | Containerization |
| CI/CD | GitHub Actions | — | Automated Deployment |
| SSL | Let's Encrypt | — | TLS Certificates |
| IDE | Visual Studio Code | Latest | Development |
| API Test | Postman | Latest | API Testing |
| DB Tool | DBeaver | Latest | DB Management |

---

# APPENDIX B: GLOSSARY OF TERMS

| Term | Definition |
|---|---|
| **BOQ** | Bill of Quantities — a document listing all materials, labour, and other costs for a construction project |
| **DPR** | Daily Progress Report — a site-level daily report of work done, manpower, and materials |
| **EVM** | Earned Value Management — a project performance measurement technique |
| **GRN** | Goods Receipt Note — a document recording the receipt of materials from a vendor |
| **JWT** | JSON Web Token — a compact, URL-safe token for stateless authentication |
| **MRN** | Material Requisition Note — a formal request from site to procure materials |
| **NCR** | Non-Conformance Report — a formal record of a deviation from quality or safety standards |
| **PO** | Purchase Order — a formal procurement document issued to a vendor |
| **RBAC** | Role-Based Access Control — access control model based on user roles |
| **SPI** | Schedule Performance Index — EVM metric; SPI > 1 means ahead of schedule |
| **CPI** | Cost Performance Index — EVM metric; CPI > 1 means under budget |
| **WBS** | Work Breakdown Structure — hierarchical decomposition of project work into manageable tasks |
| **TLS** | Transport Layer Security — cryptographic protocol for encrypted communication |
| **HSTS** | HTTP Strict Transport Security — security policy mechanism enforcing HTTPS |
| **ORM** | Object-Relational Mapping — software technique mapping database tables to programming objects |
| **REST** | Representational State Transfer — architectural style for distributed hypermedia systems |
| **SRS** | Software Requirements Specification — a comprehensive description of system requirements |
| **3NF** | Third Normal Form — database normalization level eliminating transitive dependencies |

---

*End of MCSP-232 Project Synopsis*
*Construction Management System*
*Total Sections: 12 + 2 Appendices*

---
