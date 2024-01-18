import bctypt from "bcrypt";

export const passwordHash = async (password) => {
  try {
    const hashPassword = await bctypt.hash(password, 8);
    return hashPassword;
  } catch (e) {
    console.log(e.message);
  }
};

export const passwordCompare = async (password, hashPassword) => {
  return bctypt.compare(password, hashPassword);
};
