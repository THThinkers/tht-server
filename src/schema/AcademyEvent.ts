import mongoose, { Schema } from 'mongoose';

const AcademyEvent: Schema = new Schema({
  name: String,
  date: Date,
  description: String,
  presentor: { type: Schema.Types.ObjectId, ref: 'User' },
});

export default mongoose.model('AcademyEvent', AcademyEvent);
