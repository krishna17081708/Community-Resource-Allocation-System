<div align="center">

<h1>🚨 CRAS — Crisis Resource Allocation System
Prioritize emergency requests. Manage scarce resources. Track allocation transparently.</h1>

<h3>Emergency Requests • Priority Scheduling • Inventory Management • Allocation & Preemption • JWT Security • Audit Logs • GIS Map</h3>






</div>

<b>🎯 What is CRAS?</b>
CRAS (Crisis Resource Allocation System) is a prototype for managing emergency requests and allocating limited resources such as water, food, and essential supplies. It combines a Spring Boot backend, a MySQL database, and a React frontend to demonstrate request management, priority-based scheduling, inventory tracking, and role-based access.
⚠️ The problem: During an emergency, multiple requests may compete for limited supplies. Recording requests alone is not enough: the system must consider urgency, track available inventory, and maintain a record of what was allocated.

CRAS provides a foundation for handling this workflow through structured database entities, REST APIs, priority scoring, resource-specific queues, and allocation records.

The system includes:
- User registration and login with JWT-based authentication
- Role-based access for community users, resource managers, and administrators
- Emergency request creation with severity, affected population, scarcity, and location information
- Resource and inventory management
- Priority scoring and resource-specific scheduling queues
- Allocation, completion, and preemption workflows
- Audit records and allocation history
- A frontend with manager/admin views and a GIS map
<b>📌 Current Status</b>
The project is developed in phases. The repository includes more than basic request storage, but it should still be treated as a prototype rather than a production emergency-response platform.
Area	Status	Notes
MySQL database + JPA entities	✅ Implemented	Users, roles, locations, resources, requests, allocations and audit logs
Spring Boot REST backend	✅ Implemented	Controllers, services and repositories
Authentication	✅ Implemented	JWT login and registration
Authorization	✅ Implemented	Role-based access for community users, resource managers and admins
Resource management	✅ Implemented	View resources and update stock
Emergency requests	✅ Implemented	Submit and retrieve requests
Priority calculation	✅ Implemented	Non-AI weighted priority score
Scheduling queues	✅ Implemented	Resource-specific queue and aging-related scheduling logic
Allocation workflow	✅ Implemented in prototype	Allocation service, inventory updates and allocation records
Preemption workflow	✅ Present in prototype	Manager endpoint and allocation/preemption service logic
Audit and admin views	✅ Implemented	User list, allocation history, audit records and summary
WebSocket/realtime service	⚙️ Included in codebase	Verify runtime behavior and frontend integration before claiming production-ready realtime updates
GIS map	✅ Frontend feature included	Leaflet/OpenStreetMap-based map; data depends on configured locations and requests
Real ML prediction	🗓️ Not included	Priority calculation is rule-based; no AI prediction/confidence score
Production hardening and stress testing	🗓️ Future work	Requires additional testing, security review and deployment configuration


🏗️ System Architecture
React Frontend
      |
      | HTTP / REST
      v
Spring Boot Controllers
      |
      v
Service Layer
  |       |          |
  |       |          +--> Priority / Scheduling
  |       +-------------> Allocation / Preemption
  +---------------------> Authentication / Audit
      |
      v
Spring Data JPA Repositories
      |
      v
MySQL Database
Main components
- Frontend: React UI for community requests, resource manager workflows, administration, scheduling views and map visualization.
- Backend: Spring Boot REST API and service layer for request processing, priority calculation, allocation, authentication and audit operations.
- Database: MySQL with JPA entities and repositories.
- Security: Spring Security, JWT authentication, BCrypt password hashing and role-based authorization.
- Scheduling/allocation: Prototype logic for queue ordering, resource allocation, inventory changes and preemption.
🚀 Quick Start
Requirements
Tool	Version / Purpose
Java JDK	17
Maven	Compatible with the project
MySQL Server	Create the cras_db database
Node.js and npm	Run the React/Vite frontend
Git	Clone and manage the repository


1. Clone the repository
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <YOUR_REPOSITORY_FOLDER>
Replace the placeholders with your actual GitHub repository URL and folder name.
2. Create the MySQL database
Start MySQL, then create the database:
CREATE DATABASE cras_db;
If the repository contains a SQL schema file, execute it against cras_db. Otherwise, the project’s JPA configuration may create/update tables when the backend starts; verify the current schema and configuration before relying on automatic table creation.
3. Configure the backend
Open:

backend/src/main/resources/application.properties

Set your local database credentials:
spring.datasource.url=jdbc:mysql://localhost:3306/cras_db?useSSL=false&serverTimezone=Asia/Kolkata&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
Replace YOUR_MYSQL_PASSWORD with your local MySQL password. Do not commit real credentials or production secrets to GitHub.

The repository also contains a JWT secret setting. Replace the development/demo secret with a long, randomly generated secret before any non-local deployment.
4. Start the backend
Open a terminal in the project root:
cd backend
mvn spring-boot:run
The backend is configured to use port 8080.

Health check:
http://localhost:8080/api/health
5. Start the frontend
Open a second terminal:
cd frontend
npm install
npm run dev
Open the local URL printed by Vite, usually:
http://localhost:5173
👤 Roles and Access
Role	Responsibility
COMMUNITY_USER	Register, sign in and submit emergency resource requests
RESOURCE_MANAGER	Review queues, dispatch/allocate resources, and manage allocation workflows
ADMIN	Review users, allocations, audit records and administrative summaries


Public registration should create community-user accounts only. Privileged roles should be assigned through a controlled administrative process.
Demo accounts
The original project README lists these local demo accounts:
Role	Email	Password
Community user	user@cras.local	User@123
Resource manager	manager@cras.local	Manager@123
Admin	admin@cras.local	Admin@123


These credentials may depend on the configured data initializer. If they do not work in your checkout, inspect DataInitializer.java and the current database contents. Demo credentials are for local testing only; never reuse them in production.
🔌 API Reference
The following routes are present in the backend controller mappings. Authentication/role requirements and request DTO fields should be checked in the corresponding controller and security configuration.
Method	Endpoint	Purpose
GET	/api/health	Backend health check
POST	/api/auth/register	Register a community user
POST	/api/auth/login	Authenticate and receive a token
GET	/api/resources	List resources
POST	/api/resources	Create a resource
PUT	/api/resources/{id}/stock?quantity={quantity}	Update resource stock
GET	/api/requests	List emergency requests
POST	/api/requests	Create an emergency request
GET	/api/locations	List locations
POST	/api/locations	Create a location
GET	/api/manager/dashboard	Resource-manager dashboard summary
GET	/api/manager/queue	List pending requests
GET	/api/manager/queue/{resourceId}	View queue for a resource
POST	/api/manager/dispatch/{resourceId}	Run dispatch/scheduling for a resource
POST	/api/manager/allocate/{requestId}	Allocate a request
POST	/api/manager/preempt/{requestId}	Run the preemption workflow
POST	/api/manager/complete/{requestId}	Mark a request as completed
GET	/api/admin/users	List users (admin)
GET	/api/admin/audit	View audit records (admin)
GET	/api/admin/allocations	View allocation history (admin)
GET	/api/admin/summary	View administrative summary


Example: Login
POST /api/auth/login
{
  "email": "user@cras.local",
  "password": "User@123"
}
Use the returned token as a Bearer token for protected endpoints:
Authorization: Bearer <JWT_TOKEN>
Example: Create an emergency request
The backend request DTO defines the accepted fields. A representative request shape is:
{
  "requesterName": "Arushi",
  "resourceId": 1,
  "quantity": 100,
  "severity": 9,
  "affectedPeople": 30,
  "scarcity": 8
}
Check backend/src/main/java/com/cras/dto/RequestCreate.java for the exact accepted JSON fields and validation rules in your version.
🧮 Priority Calculation
The current project uses a rule-based, non-AI priority formula. The project documentation describes these weighted factors:
Factor	Weight
Severity	35%
Affected population	20%
Resource scarcity	20%
Location risk	15%
Aging / waiting time	10%


The score is intended to help order requests for scheduling. Confirm the exact normalization and calculation in PriorityService.java before comparing scores or changing the formula.

Important: AI prediction and confidence scoring are not included in this version. A weighted score is a prototype heuristic, not a validated emergency-response standard.
📦 Resource Allocation Workflow
Emergency Request
       |
       v
Validate Request and Resource
       |
       v
Calculate Priority Score
       |
       v
Place Request in Resource Queue
       |
       v
Select Request for Dispatch
       |
       v
Check Inventory and Allocation Rules
       |
       v
Allocate / Reject / Apply Preemption Policy
       |
       v
Update Request, Inventory and Allocation History
       |
       v
Write Audit Record
The intended workflow connects request priority with available inventory. A request’s priority score alone does not guarantee that the resource is available.
Database and consistency concepts
- JPA entities model users, locations, resources, emergency requests, allocations and audit logs.
- Transactions are used for allocation-related database operations.
- Pessimistic locking is intended to help prevent concurrent transactions from allocating the same inventory.
- Allocation history and audit records support traceability.
These mechanisms should be tested under concurrent load before the system is used for real emergency operations.
🔒 Security
The backend codebase includes:
- Spring Security
- JWT-based authentication
- BCrypt password hashing
- Role-based access control
- Restricted public registration
- Audit logging
Security checklist
- Change the default database password and JWT secret.
- Do not commit .env files, private keys, tokens or production credentials.
- Use HTTPS and managed secrets in a deployed environment.
- Review authorization on every manager/admin endpoint.
- Treat seeded demo accounts as local-only credentials.
🧪 Testing and Demonstration
Use Postman or another REST client to test the backend. Verify actual behavior in the running application rather than relying only on the API table.
Demo 1 — Submit a request
1. Sign in as a community user.
2. Select a resource and enter the request details.
3. Submit the emergency request.
4. Verify that the request is saved and receives a priority score.
Demo 2 — Scheduling queue
1. Sign in as a resource manager.
2. Open the scheduling/queue view.
3. Compare requests for the same resource.
4. Explain how priority and waiting time affect queue ordering, as implemented in the current service.
Demo 3 — Resource allocation
1. Choose a request for a resource with sufficient stock.
2. Run the allocation workflow.
3. Verify the allocation record and remaining inventory.
4. Try an insufficient-stock case and verify the result.
Demo 4 — Preemption
1. Prepare a lower-priority active allocation and a higher-priority request for the same resource.
2. Run the preemption workflow using the manager interface/API.
3. Inspect allocation status, inventory changes and audit history.
4. Confirm that the result matches the implemented preemption rules.
Demo 5 — Admin and audit
1. Sign in as an administrator.
2. Review users, allocation history and audit records.
3. Confirm that protected endpoints reject unauthorized roles.
Demo 6 — GIS map
1. Open the map view.
2. Check registered locations and request markers.
3. Inspect the marker information.
4. Confirm that the displayed data matches the backend response.
🗂️ Project Structure
CRAS/
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/cras/
│       │   ├── config/          # Application and data initialization
│       │   ├── controller/      # REST API controllers
│       │   ├── dto/             # Request/response DTOs
│       │   ├── entity/          # JPA entities and enums
│       │   ├── repository/      # Spring Data JPA repositories
│       │   ├── security/        # JWT and Spring Security
│       │   └── service/         # Priority, scheduling, allocation, audit
│       └── resources/
│           └── application.properties
├── database/
│   └── schema.sql               # Database schema, if used by this checkout
├── frontend/
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       └── style.css
└── README.md
Some files or directories may differ between branches. Use the repository’s actual tree as the source of truth.
🗺️ Roadmap
Phase I — Proposal and Design
- Define the emergency resource allocation problem.
- Design the initial database and system architecture.
Phase II — Working Prototype
- Database and backend integration.
- User, resource and emergency request management.
- Priority calculation and queue processing.
- Basic allocation, inventory updates and allocation history.
- Authentication, authorization and frontend integration.
Phase III — Further Development
- Validate and refine scheduling, aging and starvation-prevention policies.
- Improve preemption rules and inventory consistency under concurrent load.
- Expand real-time notifications and frontend integration.
- Add automated tests, stress testing and performance measurements.
- Evaluate optional GIS enhancements and real ML prediction as separate future work.
🤝 Contributing
1. Fork the repository.
2. Create a feature branch.
3. Make and test your changes.
4. Commit with a clear message.
5. Open a pull request.
git checkout -b feature/your-feature-name
git add .
git commit -m "Add: describe your change"
git push origin feature/your-feature-name
📚 References
- Spring Boot Documentation
- Spring Security Documentation
- Spring Data JPA Documentation
- MySQL Documentation
- React Documentation
- Leaflet Documentation
- OpenStreetMap
<div align="center">

CRAS — Making emergency resource requests more structured, traceable, and allocation-aware.

Built with Java • Spring Boot • MySQL • React
</div>
