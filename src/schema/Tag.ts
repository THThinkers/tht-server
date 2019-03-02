import mongoose, { Document, Model } from 'mongoose';

const { Schema } = mongoose;

// 타이핑
export interface ITag {
  _id: string;
  name: string;
  createAt?: Date;
}
// mongoose 타이핑
export interface ITagDocument extends Document {
  _id: string;
  name: string;
  createAt: Date;
}
const TagSchema = new Schema({
  name: { type: String, index: { unique: true } },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ITagDocument>('Tag', TagSchema) as Model<
  ITagDocument
>;
