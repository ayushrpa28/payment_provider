import request from "supertest";
import express from "express";
import cardRouter from "../routes/card.route";
import { CardService } from "../services/card.service";

// 1. Mock the Service to prevent actual DB calls
jest.mock("../services/card.service");

// 2. Mock Middleware to simulate an authenticated user
jest.mock("../middlewares/auth.middleware", () => ({
  authMiddleware: (req: any, res: any, next: any) => {
    req.userId = "test-user-123"; // Injects the userId expected by the controller
    next();
  },
}));

// 3. Setup a temporary Express app for testing
const app = express();
app.use(express.json());
app.use("/cards", cardRouter);

describe("Card Routes", () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /cards/add", () => {
    it("should successfully route to addCard and return 201", async () => {
      const mockCardResponse = { id: "card_abc", last4: "4444" };
      (CardService.addCard as jest.Mock).mockResolvedValue(mockCardResponse);

      const response = await request(app)
        .post("/cards/add")
        .send({
          cardNumber: "1234123412344444",
          expiryMonth: "12",
          expiryYear: "2030",
          brand: "Visa"
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockCardResponse);
      expect(CardService.addCard).toHaveBeenCalledWith(
        "test-user-123",
        "1234123412344444",
        "12",
        "2030",
        "Visa"
      );
    });
  });

  describe("GET /cards", () => {
    it("should route to getCards and return the list of cards", async () => {
      const mockCards = [{ id: "1", last4: "1111" }, { id: "2", last4: "2222" }];
      (CardService.getCards as jest.Mock).mockResolvedValue(mockCards);

      const response = await request(app).get("/cards");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(CardService.getCards).toHaveBeenCalledWith("test-user-123");
    });
  });

  describe("DELETE /cards/:id", () => {
    it("should route to deleteCard and return success message", async () => {
      (CardService.deleteCard as jest.Mock).mockResolvedValue({
        message: "Card deleted successfully"
      });

      const response = await request(app).delete("/cards/card_999");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Card deleted successfully");
      expect(CardService.deleteCard).toHaveBeenCalledWith("test-user-123", "card_999");
    });
  });
});