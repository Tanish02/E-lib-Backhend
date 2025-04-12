import express from "express";
import userRouter from "./user/userRouter";
import bookRouter from "./book/bookRouter";

const app = express();
app.use(express.json());

app.get("/", (req, res, next) => {
  res.json({ message: "Welcome to the E-Lib API" });
});

app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);

export default app;
