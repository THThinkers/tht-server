import bcrypt from 'bcryptjs';

const saltRounds = 10;

const generateHash = async (password: string) => {
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (err) {
    throw err;
  }
};

const checkPassword = async (password: string, hash: string) => {
  try {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  } catch (err) {
    throw err;
  }
};

export { generateHash, checkPassword };
