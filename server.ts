import app from './src/app';
import connectToDatabase from './src/Config/db';

const PORT = process.env.PORT || 5513;

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error: Error) => {
    console.error('Database connection failed', error);
    process.exit(1);
  });
