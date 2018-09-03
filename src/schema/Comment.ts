import mongoose from 'mongoose';

const { Schema } = mongoose;

const CommentSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  comment: String,
  createdAt: Date,
});

export default mongoose.model('Comment', CommentSchema);
