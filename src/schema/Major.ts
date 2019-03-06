import mongoose, { Document, Model } from 'mongoose';

const { Schema } = mongoose;

// 타이핑
export interface IMajor {
  _id: string;
  name: string;
  createAt?: Date;
}
// mongoose 타이핑
export interface IMajorDocument extends Document {
  _id: string;
  name: string;
  createAt: Date;
}
const MajorSchema = new Schema({
  name: { type: String, index: { unique: true } },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IMajorDocument>('Major', MajorSchema) as Model<
  IMajorDocument
>;
