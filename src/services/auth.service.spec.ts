import { AuthService } from "../services/auth.service";
import { prisma } from "../prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

jest.mock("../prisma/client", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("AuthService", () => {
  const mockEmail = "test@example.com";
  const mockPassword = "password123";

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test_secret";
  });

  describe("register", () => {
    it("should throw error if user already exists", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: "1" });

      await expect(AuthService.register(mockEmail, mockPassword))
        .rejects.toThrow("User already exists");
    });

    it("should hash password and create user", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed_pass");
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: "u1",
        email: mockEmail,
        passwordHash: "hashed_pass"
      });

      const result = await AuthService.register(mockEmail, mockPassword);

      expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, 10);
      expect(result).not.toHaveProperty("passwordHash");
      expect(result.email).toBe(mockEmail);
    });
  });

  describe("login", () => {
    it("should return a token for valid credentials", async () => {
      const mockUser = { id: "u1", email: mockEmail, passwordHash: "hashed" };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("mock_token");

      const token = await AuthService.login(mockEmail, mockPassword);

      expect(token).toBe("mock_token");
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: "u1" },
        "test_secret",
        { expiresIn: "1d" }
      );
    });
  });
});