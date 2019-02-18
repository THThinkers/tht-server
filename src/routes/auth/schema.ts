import Joi from 'joi';

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
    .max(99)
    .required(),
  major: Joi.string().required(),
  tags: Joi.array()
    .items(Joi.string())
    .required(),
});

export { userSchema };
