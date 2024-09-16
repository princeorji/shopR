import { cleanEnv } from 'envalid';
import { port, str } from 'envalid/dist/validators';

export default cleanEnv(process.env, {
  PORT: port(),
  DATABASE: str(),
  SESSION_SECRET: str(),
  STRIPE_SECRET: str(),
});
