import cors from "cors";
import express from "express";
import bookRouter from "./book/bookRouter";
import globleErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://e-lib-dashboard-rose.vercel.app",
      "https://e-lib-frontend-rose.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
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
