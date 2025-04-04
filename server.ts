import { config } from 'dotenv';
import app from './src/app'
import ConnectDB from './src/Config/db';


config();

const startServer = async () => {


    // Connect to the database
    await ConnectDB()

    const PORT = process.env.PORT || 3000;


    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();

