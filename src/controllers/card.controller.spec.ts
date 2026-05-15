import request from "supertest";
import express from "express";
import cardRouter from "../routes/card.route";
import { CardService } from "../services/card.service";

// Mock the Service layer
jest.mock("../services/card.service");

// Mock the Auth Middleware
jest.mock("../middlewares/auth.middleware", () => ({
  authMiddleware: (req: any, res: any, next: any) => {
    req.userId = "test-user-id"; // Simulate authenticated user
    next();
  },
}));

const app = express();
app.use(express.json());
app.use("/cards", cardRouter);

describe("Card API Endpoints", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /cards/add", () => {
    it("should add a card and return 201", async () => {
      const mockCard = { id: "card-1", brand: "Visa" };
      (CardService.addCard as jest.Mock).mockResolvedValue(mockCard);

      const response = await request(app)
        .post("/cards/add")
        .send({
          cardNumber: "1111222233334444",
          expiryMonth: "10",
          expiryYear: "2028",
          brand: "Visa",
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockCard);
      expect(CardService.addCard).toHaveBeenCalled();
    });

    it("should return 400 if service throws an error", async () => {
      (CardService.addCard as jest.Mock).mockRejectedValue(new Error("Invalid data"));

      const response = await request(app).post("/cards/add").send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid data");
    });
  });

  describe("GET /cards", () => {
    it("should return user cards", async () => {
      const mockCards = [{ id: "c1" }];
      (CardService.getCards as jest.Mock).mockResolvedValue(mockCards);

      const response = await request(app).get("/cards");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCards);
    });
  });

  describe("DELETE /cards/:id", () => {
    it("should delete a card successfully", async () => {
      (CardService.deleteCard as jest.Mock).mockResolvedValue({
        message: "Card deleted successfully",
      });

      const response = await request(app).delete("/cards/card-123");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Card deleted successfully");
      expect(CardService.deleteCard).toHaveBeenCalledWith("test-user-id", "card-123");
    });
  });
});