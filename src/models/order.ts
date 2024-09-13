import { InferSchemaType, model, Schema } from 'mongoose';
import { OrderStatus } from '../enums/orderStatus';

const schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    total: { type: Number, required: true },
    status: { type: String, enum: Object.values(OrderStatus) },
  },
  { timestamps: true }
);

type Order = InferSchemaType<typeof schema>;

export default model<Order>('Order', schema);
