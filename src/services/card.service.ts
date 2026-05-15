import { prisma } from "../prisma/client";


export class CardService {

  static async addCard(
    userId: string,
    cardNumber: string,
    expiryMonth: string,
    expiryYear: string,
    brand: string
  ) {

    const card = await prisma.card.create({
  data: {
    userId,
    encryptedCardNumber: cardNumber,
    token: "tok_" + Date.now(),
    brand,
    expiryMonth: Number(expiryMonth),
    expiryYear: Number(expiryYear),
    last4: cardNumber.slice(-4),
  },
});

    return card;
  }

  static async getCards(
    userId: string
  ) {

    const cards = await prisma.card.findMany({
      where: {
        userId,
      },
    });

    return cards;
  }

  static async deleteCard(
    userId: string,
    cardId: string
  ) {

    await prisma.card.delete({
      where: {
        id: cardId,
      },
    });

    return {
      message: "Card deleted successfully",
    };
  }
}