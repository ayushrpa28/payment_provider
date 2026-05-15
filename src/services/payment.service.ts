import { prisma } from "../prisma/client";


export class PaymentService {

  static async makePayment(
    userId: string,
    token: string,
    amount: number
  ) {

    // verify card belongs to user
    const card = await prisma.card.findFirst({
      where: {
        token,
        userId,
      },
    });

    if (!card) {
      throw new Error(
        "Card not found"
      );
    }

    // mock bank response
    const isSuccess =
      Math.random() < 0.85;

    let status = "FAILED";

    if (isSuccess) {
      status = "AUTHORIZED";
    }

   const payment =
  await prisma.payment.create({
    data: {
      userId,
      cardId: card.id,
      amount,
      status,
    },
  });
    return {
      message:
        status === "AUTHORIZED"
          ? "Payment successful"
          : "Payment failed",

      payment,
    };
  }
}