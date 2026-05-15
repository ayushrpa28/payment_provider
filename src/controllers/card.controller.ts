import { Response } from "express";
import { CardService } from "../services/card.service";
import { AuthRequest } from "../middlewares/auth.middleware";

interface DeleteCardParams {
  id: string;
}

export class CardController {

  static async addCard(
    req: AuthRequest,
    res: Response
  ) {
    try {
      const {
        cardNumber,
        expiryMonth,
        expiryYear,
        brand,
      } = req.body;

      const card = await CardService.addCard(
        req.userId!,
        cardNumber,
        expiryMonth,
        expiryYear,
        brand
      );

      res.status(201).json(card);

    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  static async getCards(
    req: AuthRequest,
    res: Response
  ) {
    try {
      const cards =
        await CardService.getCards(
          req.userId!
        );

      res.json(cards);

    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  static async deleteCard(
    req: AuthRequest & { params: DeleteCardParams },
    res: Response
  ) {
    try {
      const result =
        await CardService.deleteCard(
          req.userId!,
          req.params.id
        );

      res.json(result);

    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }
}