import mongoose, { Document, Model, Schema, MongooseDocument } from 'mongoose';
import Counter, { ICounter } from './Counter';
import { IUser } from './User';

const { Schema } = mongoose;

export interface IColumn extends Document {
  docNo?: number;
  author?: IUser;
  nextAuthor?: IUser;
  columnDocumnet?: string;
  // comments: 코멘트 확정되면
  createdAt?: Date;
}

const ColumnSchema: Schema = new Schema({
  docNo: { type: Number, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  nextAuthor: { type: Schema.Types.ObjectId, ref: 'User' },
  columnDocument: String,
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  createdAt: Date,
});

ColumnSchema.pre('save', async function(this: IColumn, next) {
  if (this.docNo === null) {
    const counter: ICounter =
      (await Counter.findByIdAndUpdate('Column', {
        $inc: { count: 1 },
      })) || (await Counter.create({ _id: 'Column' }));
    this.docNo = counter.count;
  }
  next();
});

export default mongoose.model<IColumn>('Column', ColumnSchema) as Model<
  IColumn
>;
