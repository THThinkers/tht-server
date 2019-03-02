import { RequestHandler } from 'express';
import Tag from '../../schema/Tag';
import { IUser } from '../../schema/User';
interface ISavedTag {
  _id: string;
}
interface IAddTag {
  name: string;
}
interface IUserTags {
  savedTags: ISavedTag[];
  addTags: IAddTag[];
}
const addSignupTags: RequestHandler = async (req, res, next) => {
  // 태그 추가
  try {
    const user = req.body as IUser;
    const { savedTags, addTags } = user.tags.reduce(
      (acc: IUserTags, curr: ISavedTag | IAddTag) => {
        if ('_id' in curr) {
          acc.savedTags.push(curr);
        } else {
          acc.addTags.push(curr);
        }
        return acc;
      },
      { savedTags: [], addTags: [] } as IUserTags,
    );
    user.tags = savedTags;
    const newTags = await Tag.insertMany(addTags, { ordered: false });
    // ordered: false - 하나 validation 실패해도 전체 save를 중단하지 않음.
    // https://stackoverflow.com/questions/44447730/property-0-is-missing-in-type
    user.tags = [...user.tags, ...newTags.map((tag) => ({ _id: tag._id }))];
    next();
  } catch (err) {
    // 태그추가에 대한 에러는 일단 무시하는걸로..
    next();
  }
};

export { addSignupTags };
