import { InferSchemaType, model, Schema } from 'mongoose';

const schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

type Cart = InferSchemaType<typeof schema>;

export default model<Cart>('Cart', schema);
