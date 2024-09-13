import { InferSchemaType, model, Schema } from 'mongoose';

const schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
  },
  { timestamps: true }
);

type Product = InferSchemaType<typeof schema>;

export default model<Product>('Product', schema);
