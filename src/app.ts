import express from 'express';

const app = express();

// Routes-
// HTTP methods: GET, POST, PUT, PATCH, DELETE 

app.get('/', (req, res, next) => {
    res.json({ message: "Welcome to E-Lib APIS" });

    
});


export default app;