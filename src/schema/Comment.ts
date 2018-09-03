import mongoose, { Schema } from 'mongoose';

const CommentSchema: Schema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  comment: String,
  createdAt: Date,
});

export default mongoose.model('Comment', CommentSchema);
