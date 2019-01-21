import { IUser } from '../schema/User';

export type IUserSignup = Pick<IUser, 'username' | 'password' | 'name'>;
