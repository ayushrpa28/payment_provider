import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { PaymentService } from "../services/payment.service";


export class PaymentController {

  static async makePayment(
    req: AuthRequest,
    res: Response
  ) {

    try {

      const {
        token,
        amount,
      } = req.body;

      const payment =
        await PaymentService.makePayment(
          req.userId!,
          token,
          amount
        );

      res.status(201).json(payment);

    } catch (error: any) {

      res.status(400).json({
        message: error.message,
      });
    }
  }
}