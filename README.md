# CRAS – Phase 2 (40% Working Prototype)

This version is intentionally limited to the work appropriate for Phase II:
DATABASE + BACKEND DEVELOPMENT.

It does NOT implement the complete Phase III scheduling/allocation engine.

## Implemented in Phase II

### Database
- MySQL
- Users
- Resources
- Resource requests
- Location stored with users
- Resource quantity/inventory

### Backend
- Spring Boot
- REST APIs
- JPA repositories
- Request creation
- Resource creation/viewing
- User creation/viewing
- Basic priority-score calculation

### Priority prototype
The Phase-II formula is:

Priority Score =
    Severity (40%)
  + Affected People (30%)
  + Resource Scarcity (30%)

Score is approximately 0–100.

## Intentionally NOT implemented yet

These belong to later phases:
- Full priority aging
- Preemption
- Resource-specific OS queues
- Final resource allocation engine
- Row-level locking
- Advanced concurrency control
- WebSockets
- React dashboard
- Real ML prediction
- GIS
- Stress testing

## Setup

1. Install Java 17, Maven and MySQL.
2. Create the database:

   mysql -u root -p < database.sql

3. Open:

   src/main/resources/application.properties

4. Replace:

   YOUR_MYSQL_PASSWORD

   with your MySQL password.

5. Run:

   mvn spring-boot:run

6. Server:

   http://localhost:8080

## API 1 – Add User

POST /api/users

JSON:
{
  "name": "Arushi",
  "email": "arushi@example.com",
  "role": "COMMUNITY_USER",
  "location": "Dehradun"
}

## API 2 – Add Resource

POST /api/resources

JSON:
{
  "name": "Water",
  "unit": "litre",
  "availableQuantity": 1000
}

## API 3 – View Resources

GET /api/resources

## API 4 – Submit Emergency Request

POST /api/requests

JSON:
{
  "requesterName": "Arushi",
  "resourceId": 1,
  "quantity": 100,
  "severity": 9,
  "affectedPeople": 30,
  "scarcity": 8
}

The backend calculates the priority score automatically.

## API 5 – View Requests

GET /api/requests

Requests are displayed in descending priority-score order.

## Example

For:

severity = 9
affectedPeople = 30
scarcity = 8

Score =
(9/10 × 40)
+ (30/100 × 30)
+ (8/10 × 30)

= 36 + 9 + 24

= 69

The request is saved in MySQL with priorityScore = 69.

## Phase-II demonstration

1. Start MySQL.
2. Start Spring Boot.
3. Add 2–3 resources.
4. Add 2–3 users.
5. Submit requests with different severity/scarcity values.
6. GET /api/requests.
7. Show that requests are stored in MySQL and ordered by priority.

This is a deliberately incomplete 40% prototype so Phase III can add
the OS scheduling engine, aging, preemption and final allocation logic.
