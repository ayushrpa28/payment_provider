import { Router } from "express";
import { CardController } from "../controllers/card.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post(
  "/add",
  authMiddleware,
  CardController.addCard
);

router.get(
  "/",
  authMiddleware,
  CardController.getCards
);

router.delete(
  "/:id",
  authMiddleware,
  CardController.deleteCard
);

export default router;