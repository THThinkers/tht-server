import mongoose from 'mongoose';

const { Schema } = mongoose;

const TagSchema = new Schema({
  tag: String,
  createdAt: Date,
});

export default mongoose.model('Tag', TagSchema);
