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
  ended: Joi.string().required(),
  tags: Joi.array()
    .items(
      Joi.object().keys({
        _id: Joi.string(),
        name: Joi.string(),
      }),
    )
    .required(),
});

export { signinSchema, userSchema };
