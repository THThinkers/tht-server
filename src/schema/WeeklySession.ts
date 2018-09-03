import mongoose from 'mongoose';

const { Schema } = mongoose;

const WeeklySession = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  // Team, Thread관련 좀 더 논의 필요
});

export default mongoose.model('WeeklySession', WeeklySession);
