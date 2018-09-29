import mongoose, { Document, Model } from 'mongoose';

const { Schema } = mongoose;

export interface ICounter extends Document {
  _id: string;
  count?: number;
}

const CounterSchema = new Schema({
  _id: { type: String, requred: true },
  count: { type: Number, default: 0 },
});

const Counter: Model<ICounter> = mongoose.model('Counter', CounterSchema);

export default Counter;
