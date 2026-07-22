cat > /workspaces/ExportPro/README.md << 'EOF'
# ExportPro 🚗

A full-stack used car export platform, inspired by PAExports.com — built as a hands-on learning project.

## Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- React Router
- Axios

**Backend**
- Java 25 (LTS)
- Spring Boot 4.1
- Spring Security + JWT (stateless authentication)
- Spring Data JPA (Hibernate)

**Database**
- MySQL 8.4 (Dockerized)

**Dev Environment**
- GitHub Codespaces (devcontainer-based)

## Project Structure
ExportPro/
├── BackEnd/ → Spring Boot REST API
├── FrontEnd/ → React application
└── README.md

## Features Implemented So Far

- ✅ JWT-based authentication (signup/login)
- ✅ Role-based access control (ADMIN / CUSTOMER)
- ✅ Password hashing (BCrypt)
- ✅ React login flow connected to backend
- ✅ Frontend route guards (role + auth protected pages)
- ✅ Car domain model: Car, Port, CarImage, RepairRecord entities
- ✅ Admin CRUD APIs for Cars and Ports

## In Progress

- ⬜ Image upload handling for car listings
- ⬜ Repair record logging endpoints
- ⬜ Real Admin Dashboard UI
- ⬜ Customer-facing shop (browse/buy cars)

## Local Setup (Codespaces)

1. Open in GitHub Codespaces (devcontainer auto-installs Java 25, Node, Docker)
2. Start MySQL:
```bash
   docker start exportpro-mysql
```
   (first time only — create it with `docker run --name exportpro-mysql -e MYSQL_ROOT_PASSWORD=root123 -e MYSQL_DATABASE=exportpro_db -p 3306:3306 -d mysql:8.4`)
3. Start backend:
```bash
   cd BackEnd
   ./mvnw spring-boot:run
```
4. Start frontend:
```bash
   cd FrontEnd
   npm run dev
```

## Author

Bragadheesh — learning full-stack development by building this project step by step.
EOF
