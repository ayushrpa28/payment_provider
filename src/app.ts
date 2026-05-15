import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { prisma } from "./prisma/client";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.route";
import cardRoutes from "./routes/card.route";
import paymentRoutes from "./routes/payment.route";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/cards", cardRoutes);
app.use("/payments", paymentRoutes);

app.get("/", (req, res) => {
  res.send("Payment Provider API Running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
      await prisma.$connect();

  console.log("Database connected");
  console.log(`Server running on port ${PORT}`);
});