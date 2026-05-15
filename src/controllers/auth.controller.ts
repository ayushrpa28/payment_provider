import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { registerSchema } from "../utils/validators";

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const data = registerSchema.parse(req.body);

      const user = await AuthService.register(
        data.email,
        data.password
      );

      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const token = await AuthService.login(
        req.body.email,
        req.body.password
      );

      res.json({ token });
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }
}