import { InferSchemaType, model, Schema } from 'mongoose';

const schema = new Schema({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
  },
  quantity: { type: Number, required: true },
  itemPrice: { type: Number, required: true },
});

type OrderItem = InferSchemaType<typeof schema>;

export default model<OrderItem>('OrderItem', schema);
