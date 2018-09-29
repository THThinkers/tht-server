import mongoose from 'mongoose';
import { Schema, Model, Document } from 'mongoose'; // typescript d.ts

// model은 내부에서 this를 쓰기 떄문에 destructuring하면 binding이 안된다.

// mongoose typescript 모델링
// User 모델은 밖으로 뺴놔도 좋을듯?
export interface IUser extends Document {
  name?: string;
  password?: string;
  isAdmin?: boolean;
  isVerified?: boolean;
  kakaoId?: string;
  googleId?: string;
  profilePicture?: string;
  description?: string;
  joind: Date;
  ended: Date;
  major: string;
  studentId: number;
  tags: [{}];
  createdAt: Date;
}

export interface IUserModel extends Model<IUser> {
  findOneOrCreate(query: {}, ...args): void;
}

const UserSchema = new Schema({
  name: String,
  password: String,
  isAdmin: Boolean, // 학회장 권한 설정
  isVerified: { type: Boolean, default: false }, // 필수 정보입력 했는지 여부
  kakaoId: { type: String, default: null }, // 카카오 연동을 위함
  googleId: { type: String, default: null }, // 구글 로그인 api에서 제공하는 id.
  profilePicture: String,

  /* --------- 사용자 정보 ----- */
  description: { type: String, default: '안녕하세요' }, // 자기소개
  // 학회 활동 기간을 측정하기 위해서 가입, 종료 시점을 보여줌
  joind: Date,
  ended: Date,
  major: String, // 전공
  studentId: { type: Number, min: 0, max: 99 }, // 학번년도
  /*
    사용자 선호 태그
    실제로 스키마가 저장되는 건 아니고 _id가 저장되고 불러올때는 몽고디비의 $lookup을 통해서 가져온다함.
    mongoose : https://mongoosejs.com/docs/populate.html
    mongodb : https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/
  */
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  /* ------------------------- */

  /* --------- 활동 정보 ------ */
  // [칼럼 ID]
  // ... 기타
  /* ------------------------- */

  createdAt: Date,
});

UserSchema.statics.findOneOrCreate = function findOneOrCreate(query, ...args) {
  const self = this;
  const projection = args.length > 1 ? args[0] : {};
  const callback = args[args.length - 1];
  self.findOne(query, projection, (err, user) => {
    if (err) {
      return callback(err, null);
    }
    if (user) {
      return callback(null, user);
    }
    self.create(query, (err, user) => {
      return callback(err, user);
    });
  });
};

export default mongoose.model<IUser>('User', UserSchema) as IUserModel;
