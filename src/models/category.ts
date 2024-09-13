import { InferSchemaType, model, Schema } from 'mongoose';

const schema = new Schema({
  name: { type: String, required: true },
});

type Category = InferSchemaType<typeof schema>;

export default model<Category>('Category', schema);
