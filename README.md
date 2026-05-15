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

---

## 🔌 API Reference

### 1. Authentication Module
Base Path: /auth

| Method | Endpoint  | Functionality |
| :---   | :---      | :---          |
| POST   | /register | AuthController.register: Creates a new user account with hashed passwords. |
| POST   | /login    | AuthController.login: Validates credentials and returns a JWT token. |

### 2. Card Management Module
Base Path: /cards
(All endpoints require an Authorization: Bearer <token> header)

| Method | Endpoint | Functionality |
| :---   | :---     | :---          |
| POST   | /add     | CardController.addCard: Securely saves a card and generates a unique token. |
| GET    | /        | CardController.getCards: Retrieves all cards associated with the authenticated user. |
| DELETE | /:id     | CardController.deleteCard: Removes a card from the database using its unique ID. |

---

## 🛡 Security Workflow
1. Validation: Every request is intercepted by Zod schemas to ensure data integrity.
2. Authentication: The authMiddleware verifies the JWT on protected routes, ensuring users only access their own data.
3. Data Protection: Sensitive card numbers are handled via tokenization logic in the service layer, storing only the last4 for reference.

---

## 🧪 Testing
The project uses Jest for unit tests and Supertest for endpoint integration testing.

# Run all tests
npx jest

Ayush Sinha
