import { Request, Response } from "express";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../services/auth.service";

// Mock the AuthService
jest.mock("../services/auth.service");

describe("AuthController", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should return 201 and user data when registration is successful", async () => {
      const userData = { email: "test@example.com", password: "password123" };
      const mockSafeUser = { id: "1", email: "test@example.com" };
      
      mockRequest = { body: userData };
      (AuthService.register as jest.Mock).mockResolvedValue(mockSafeUser);

      await AuthController.register(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(mockSafeUser);
      expect(AuthService.register).toHaveBeenCalledWith(userData.email, userData.password);
    });

    it("should return 400 when Zod validation fails (invalid email)", async () => {
      // Sending an invalid email to trigger registerSchema.parse error
      mockRequest = { body: { email: "not-an-email", password: "123" } };

      await AuthController.register(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.any(String),
      }));
    });

    it("should return 400 when AuthService throws an error (e.g., User already exists)", async () => {
      mockRequest = { body: { email: "exists@test.com", password: "password123" } };
      (AuthService.register as jest.Mock).mockRejectedValue(new Error("User already exists"));

      await AuthController.register(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ message: "User already exists" });
    });
  });

  describe("login", () => {
    it("should return 200 and a token on successful login", async () => {
      const loginData = { email: "test@example.com", password: "password123" };
      const mockToken = "fake-jwt-token";
      
      mockRequest = { body: loginData };
      (AuthService.login as jest.Mock).mockResolvedValue(mockToken);

      await AuthController.login(mockRequest as Request, mockResponse as Response);

      expect(statusMock).not.toHaveBeenCalledWith(400); // Should default to 200
      expect(jsonMock).toHaveBeenCalledWith({ token: mockToken });
    });

    it("should return 400 when login credentials are invalid", async () => {
      mockRequest = { body: { email: "wrong@test.com", password: "wrong" } };
      (AuthService.login as jest.Mock).mockRejectedValue(new Error("Invalid credentials"));

      await AuthController.login(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Invalid credentials" });
    });
  });
});