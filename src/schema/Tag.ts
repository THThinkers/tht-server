import mongoose, { Document, Model } from 'mongoose';

const { Schema } = mongoose;

export interface ITag extends Document {
  tag: string;
  createAt: Date;
}
const TagSchema = new Schema({
  tag: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ITag>('Tag', TagSchema) as Model<ITag>;
