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
import session, { Cookie } from "express-session";
import passport from "passport";
import path from "path";
import reservationTableRoutes from "./routes/reservationTableRoutes";
import ReservationTableServices from "./services/ReservationTableService";
import Table from "./models/Table";
import reservationRoutes from "./routes/reservationRoutes";
import ReservationServices from "./services/ReservationServices";
import Reservation from "./models/Reservation";

const app = express();
const sharedItemServices = new SharedItemServices(SharedItem);
const authServices = new AuthServices(User);
const borrowListServices = new SharedItemBorrowListServices(
  SharedItemBorrowList
);
const reservationServices = new ReservationServices(Reservation);
const reservationTableServices = new ReservationTableServices(Table);
var sess = {
  secret: "keyboard cat",
  cookie: {
    sameSite: "lax",
  } as Cookie,
};

// Set express session cookie to secure for production only
if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
  sess.cookie.sameSite = false;
}

app.use(session(sess));
app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:3000",
      "http://jutaberlian.id:3001",
      "https://jutaberlian.id",
    ],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/api/v1/images",
  express.static(path.resolve(__dirname, "..", "uploads"))
);
app.get("/api/v1", (req, res) => {
  res.send("Hello World!");
});
app.use("/api/v1", swaggerRoute);
app.use("/api/v1/auth", authRoute(authServices));
app.use("/api/v1", sharedItemRoute(sharedItemServices));
app.use("/api/v1", sharedItemBorrowListRoute(borrowListServices));
app.use("/api/v1", reservationTableRoutes(reservationTableServices));
app.use("/api/v1", reservationRoutes(reservationServices));

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
