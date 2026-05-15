# Payment Provider API (Node.js + Express + Prisma)

## 📌 Description
A secure backend API for managing user authentication and payment card data. This project uses **Temporal-style separation of concerns** (Services, Controllers, and Routes) to ensure scalability, security, and high test coverage.

---

## 🛠 Tech Stack
- **Runtime**: Node.js (v18+)
- **Language**: TypeScript
- **Framework**: Express.js
- **Database (ORM)**: Prisma
- **Security**: JWT (Authentication) & Bcrypt (Password Hashing)
- **Validation**: Zod
- **Testing**: Jest & Supertest

---

## 📂 Project Structure

```text
src/
  ├── controllers/    # Request handlers (Extracts data, calls services)
  │   ├── auth.controller.ts
  │   └── card.controller.ts
  ├── services/       # Business Logic (DB interactions, Encryption)
  │   ├── auth.service.ts
  │   └── card.service.ts
  ├── routes/         # API Endpoint definitions
  │   ├── auth.routes.ts
  │   └── card.route.ts
  ├── middlewares/    # Authentication & Guard logic
  │   └── auth.middleware.ts
  ├── prisma/         # Schema and Client configuration
  ├── utils/          # Validation schemas (Zod)
  └── app.ts       # Entry point
each folder will be having its own spec.ts file  specific for auth,payment and card              # Unit and Integration test suites
