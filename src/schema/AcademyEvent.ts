import mongoose from 'mongoose';

const { Schema } = mongoose;

const AcademyEvent = new Schema({
  name: String,
  date: Date,
  description: String,
  presentor: { type: Schema.Types.ObjectId, ref: 'User' },
});

export default mongoose.model('AcademyEvent', AcademyEvent);
