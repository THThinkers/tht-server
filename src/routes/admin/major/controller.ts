import { RequestHandler } from 'express';
import Major, { IMajor } from '../../../schema/Major';

const getMajorList: RequestHandler = async (req, res, next) => {
  try {
    const majors = await Major.find();
    return res.json({
      payload: majors,
    });
  } catch (err) {
    next(err);
  }
};

const addMajor: RequestHandler = async (req, res, next) => {
  try {
    const { name } = req.body;
    console.log(name);
    const major = new Major();
    major.name = name;
    const newMajor = await major.save();
    return res.json({
      success: true,
      payload: newMajor,
    });
  } catch (err) {
    next(err);
  }
};

const updateMajor: RequestHandler = async (req, res, next) => {
  try {
    const { _id, ...updateFields } = req.body as IMajor;
    const major = await Major.findByIdAndUpdate(_id, updateFields);
    return res.json({
      success: true,
      payload: major,
    });
  } catch (err) {
    next(err);
  }
};

const deleteMajor: RequestHandler = async (req, res, next) => {
  try {
    const { majorId } = req.query;
    await Major.deleteOne({ _id: majorId });
    res.json({
      success: true,
      payload: majorId,
    });
  } catch (err) {
    next(err);
  }
};
export { getMajorList, addMajor, updateMajor, deleteMajor };
