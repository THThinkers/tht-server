import mongoose from 'mongoose';
import { Document, Model, Schema } from 'mongoose'; // typescript d.ts
import { checkPassword, generateHash } from '../utils/crypt';
// model은 내부에서 this를 쓰기 떄문에 destructuring하면 binding이 안된다.
// mongoose typescript 모델링
// User 모델은 밖으로 뺴놔도 좋을듯?
export interface IUser extends Document {
  name?: string;
  username: string;
  password: string;
  isActive?: boolean;
  isAdmin?: boolean;
  isVerified?: boolean;
  isLinked?: boolean;
  fillRequired?: boolean;
  kakaoId?: string;
  googleId?: string;
  profilePicture?: string;
  description?: string;
  joined: string;
  ended: string;
  major: string;
  studentId: number;
  tags: Array<{ _id: string }>;
  createdAt: Date;
}
interface IUserDocument extends IUser {
  comparePassword(password: string): boolean;
}
export interface IUserModel extends Model<IUserDocument> {
  findOneOrCreate(query: {}, ...args): void;
}

const UserSchema = new Schema({
  username: String, // id (email 형식)
  password: String,
  isAdmin: { type: Boolean, default: false }, // 학회장 권한 설정
  isVerified: { type: Boolean, default: false }, // 학회장 승인 받았는지 여부
  isLinked: { type: Boolean, default: false }, // 소셜계정이랑 연동됐는지 여부
  fillRequired: { type: Boolean, default: false }, // 필수 정보 입력했는지 여부
  kakaoId: { type: String, default: null }, // 카카오 연동을 위함
  googleId: { type: String, default: null }, // 구글 로그인 api에서 제공하는 id.
  profilePicture: String,

  /* --------- 사용자 정보 ----- */
  isActive: { type: Boolean, default: false }, // 현재 활동중인지 여부
  name: String, // 사용자 이름
  description: { type: String, default: '안녕하세요' }, // 자기소개
  phoneNumber: String, // 폰번호
  // 학회 활동 기간을 측정하기 위해서 가입, 종료 시점을 보여줌
  joined: String,
  ended: String,
  major: { type: Schema.Types.ObjectId, ref: 'Major' }, // 전공
  studentId: { type: Number, min: 0, max: 9999 }, // 학번년도
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

  createdAt: { type: Date, default: Date.now },
});

UserSchema.pre('save', async function(this, next) {
  const user = this as IUser;
  try {
    // 패스워드 암호화
    if (!user.password) {
      throw new Error('암호화활 패스워드가 없습니다.');
    }
    const hash = await generateHash(user.password);
    user.password = hash;
    next();
  } catch (err) {
    err.isOperational = true;
    next(err);
  }
});
// this.password 가져오려면 password 필드 projection에 넣어줘야함.
UserSchema.methods.comparePassword = async function comparePassword(
  candidate: string,
) {
  try {
    const isMatch = await checkPassword(candidate, this.password);
    return isMatch;
  } catch (err) {
    return false;
  }
};
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
    self.create(query, (error, newUser) => {
      return callback(error, newUser);
    });
  });
};

export default mongoose.model<IUser>('User', UserSchema) as IUserModel;
