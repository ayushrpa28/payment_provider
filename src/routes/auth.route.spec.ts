import request from "supertest";
import express from "express";
import authRouter from "../routes/auth.routes";
import { AuthService } from "../services/auth.service";

jest.mock("../services/auth.service");

const app = express();
app.use(express.json());
app.use("/auth", authRouter);

describe("Auth Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /auth/register", () => {
    it("should return 201 on successful registration", async () => {
      const mockUser = { id: "u1", email: "test@test.com" };
      (AuthService.register as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app)
        .post("/auth/register")
        .send({
          email: "test@test.com",
          password: "password123" // Ensure this matches your Zod schema requirements
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockUser);
    });

    it("should return 400 if validation fails", async () => {
      // Sending invalid email format
      const response = await request(app)
        .post("/auth/register")
        .send({ email: "invalid-email", password: "123" });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("POST /auth/login", () => {
    it("should return 200 and a token", async () => {
      (AuthService.login as jest.Mock).mockResolvedValue("fake_jwt_token");

      const response = await request(app)
        .post("/auth/login")
        .send({ email: "test@test.com", password: "password123" });

      expect(response.status).toBe(200);
      expect(response.body.token).toBe("fake_jwt_token");
    });

    it("should return 400 for invalid credentials", async () => {
      (AuthService.login as jest.Mock).mockRejectedValue(new Error("Invalid credentials"));

      const response = await request(app)
        .post("/auth/login")
        .send({ email: "wrong@test.com", password: "wrong" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid credentials");
    });
  });
});