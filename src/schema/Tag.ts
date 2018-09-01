import mongoose, { Schema } from 'mongoose';

const TagSchema = new Schema({
  id: String,
  tag: String,
  createdAt: Date,
});

export default mongoose.model('Tag', TagSchema);
