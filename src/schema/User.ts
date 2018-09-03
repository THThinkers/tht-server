import mongoose from 'mongoose';

const { Schema } = mongoose;
// Schema는 destructuring 하고 model은 안하는 이유.
// model은 내부에서 this를 쓰기 떄문에 destructuring하면 binding이 안된다.
const UserSchema = new Schema({
  name: String,
  password: String,
  isAdmin: Boolean, // 학회장 권한 설정
  facebookId: { type: String, default: null }, // 페이스북 연동을 위함
  profilePicture: String,

  /* --------- 사용자 정보 ----- */
  descirption: { type: String, default: '안녕하세요' }, // 자기소개
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

export default mongoose.model('User', UserSchema);
