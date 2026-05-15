import { CardService } from "../services/card.service";
import { prisma } from "../prisma/client";

// Mock the prisma client
jest.mock("../prisma/client", () => ({
  prisma: {
    card: {
      create: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe("CardService", () => {
  const mockUserId = "user-123";
  const mockCardData = {
    cardNumber: "1234567812345678",
    expiryMonth: "12",
    expiryYear: "2025",
    brand: "Visa",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("addCard", () => {
    it("should create a new card and return it", async () => {
      const createdCard = { id: "card-1", ...mockCardData, last4: "5678" };
      (prisma.card.create as jest.Mock).mockResolvedValue(createdCard);

      const result = await CardService.addCard(
        mockUserId,
        mockCardData.cardNumber,
        mockCardData.expiryMonth,
        mockCardData.expiryYear,
        mockCardData.brand
      );

      expect(prisma.card.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          userId: mockUserId,
          last4: "5678",
        }),
      }));
      expect(result).toEqual(createdCard);
    });
  });

  describe("getCards", () => {
    it("should return all cards for a user", async () => {
      const mockCards = [{ id: "1" }, { id: "2" }];
      (prisma.card.findMany as jest.Mock).mockResolvedValue(mockCards);

      const result = await CardService.getCards(mockUserId);

      expect(prisma.card.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId },
      });
      expect(result).toEqual(mockCards);
    });
  });
});