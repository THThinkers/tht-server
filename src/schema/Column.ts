import mongoose from 'mongoose';

const { Schema } = mongoose;

const ColumnSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  nextAuthor: { type: Schema.Types.ObjectId, ref: 'User' },
  columnDocument: String,
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  createAt: Date,
});

export default mongoose.model('Column', ColumnSchema);
