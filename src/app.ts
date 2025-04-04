import express, { Request, Response, NextFunction } from 'express';
import globalErrorHandler from './middlewares/globalErrorHandler';
import userRouter from './user/userRouter';


const app = express();

// Routes===
 

app.get('/', (req, res, next) => {

    // throw new Error("This is a test error");
    // const error = createHttpError(404, "This is a test error");
    // throw error;

    res.json({ message: "Welcome to E-Lib API" });
});



app.use("/api/users", userRouter);




//global error handler


app.use(globalErrorHandler);





export default app;