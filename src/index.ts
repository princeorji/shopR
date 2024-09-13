import mongoose from 'mongoose';
import app from './app';
import env from './utils/validateEnv';

const port = env.PORT;

mongoose
  .connect(env.DATABASE)
  .then(() => {
    console.log('Connection established successfully 🥳');
    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
    });
  })
  .catch(console.error);
