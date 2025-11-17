import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import { PORT } from "./constant";
import { connectDB, syncModels } from "./utils/db";
import ClientError from "./exceptions/ClientError";
import InvariantError from "./exceptions/InvariantError";
import sharedItemRoute from "./routes/sharedItemRoute";
import cors from "cors";
import SharedItemServices from "./services/SharedItemServices";
import SharedItem from "./models/SharedItem";
import swaggerRoute from "./routes/swaggerRoute";
import authRoute from "./routes/authRoute";
import AuthServices from "./services/AuthServices";
import User from "./models/User";
import SharedItemBorrowListServices from "./services/SharedItemBorrowListServices";
import SharedItemBorrowList from "./models/SharedItemBorrowList";
import sharedItemBorrowListRoute from "./routes/sharedItemBorrowListRoute";

const app = express();
const sharedItemServices = new SharedItemServices(SharedItem);
const authServices = new AuthServices(User);
const borrowListServices = new SharedItemBorrowListServices(
  SharedItemBorrowList
);

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api/v1", swaggerRoute);
app.use("/api/v1", authRoute(authServices));
app.use("/api/v1", sharedItemRoute(sharedItemServices));
app.use("/api/v1", sharedItemBorrowListRoute(borrowListServices));

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  if (err instanceof ClientError) {
    if (err instanceof InvariantError) {
      return res
        .status(err.statusCode)
        .json({ status: "fail", data: err.data });
    }

    return res
      .status(err.statusCode)
      .json({ status: "fail", message: err.message });
  }
  next(err);
});

app.listen(PORT, async () => {
  try {
    await connectDB();
    await syncModels();
    console.log(`Server is running on http://localhost:${PORT}`);
  } catch (error) {
    console.error("Failed to start server");
    throw error;
  }
});
