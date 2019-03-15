import Joi from 'joi';

const signinSchema = Joi.object().keys({
  username: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .regex(/^(?=.*[a-z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,15}$/)
    .required(),
});
const userSchema = Joi.object().keys({
  username: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .regex(/^(?=.*[a-z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,15}$/)
    .required(),
  name: Joi.string()
    .regex(/^[가-힣]{2,4}$/)
    .required(),
  phoneNumber: Joi.string().required(),
  studentId: Joi.number()
    .min(0)
    .max(9999)
    .required(),
  major: Joi.string().required(),
  joined: Joi.string().required(),
  ended: Joi.string().allow(''),
  tags: Joi.array()
    .items(
      Joi.object({
        _id: Joi.string(),
        name: Joi.string(),
      }).unknown(true),
    )
    .required(),
});
const linkSchema = signinSchema.keys({
  googleId: Joi.string(),
  kakaoId: Joi.string(),
  name: Joi.string().regex(/^[가-힣]{2,4}$/),
  phoneNumber: Joi.string(),
  studentId: Joi.number()
    .min(0)
    .max(9999),
  major: Joi.string(),
  joined: Joi.string(),
  ended: Joi.string(),
  tags: Joi.array().items(
    Joi.object()
      .keys({
        _id: Joi.string(),
        name: Joi.string(),
      })
      .unknown(true),
  ),
  isNew: Joi.boolean(),
});
export { signinSchema, userSchema, linkSchema };
