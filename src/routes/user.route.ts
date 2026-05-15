import { Router, Response } from "express";
import {
  authMiddleware,
  AuthRequest,
} from "../middlewares/auth.middleware";

const router = Router();

router.get(
  "/me",
  authMiddleware,
  (req: AuthRequest, res: Response) => {
    res.json({
      message: "Protected route working",
      userId: req.userId,
    });
  }
);

export default router;