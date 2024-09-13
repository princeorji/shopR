import { InferSchemaType, model, Schema } from 'mongoose';

const schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  phone: { type: String },
});

type User = InferSchemaType<typeof schema>;

export default model<User>('User', schema);
