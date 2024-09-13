import { InferSchemaType, model, Schema } from 'mongoose';

const schema = new Schema({
  cartId: {
    type: Schema.Types.ObjectId,
    ref: 'Cart',
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
  },
  quantity: { type: Number, required: true },
});

type CartItem = InferSchemaType<typeof schema>;

export default model<CartItem>('CartItem', schema);
