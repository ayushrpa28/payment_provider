import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware";
import { PaymentController } from "../controllers/payment.controller";

const router = Router();

router.post(
  "/",
  authMiddleware,
  PaymentController.makePayment
);

export default router;