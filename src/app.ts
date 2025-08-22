import express from "express";
import globleErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";
import bookRouter from "./book/bookRouter";
import cors from "cors";
import { config } from "./Config/config";

const app = express();

app.use(
  cors({
    origin: config.frontendDomain,
  })
);
app.use(express.json());

app.get("/", (req, res, next) => {
  res.json({ message: "Welcome to the E-Lib API" });
});

app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);

// Global error handler
app.use(globleErrorHandler);

export default app;
