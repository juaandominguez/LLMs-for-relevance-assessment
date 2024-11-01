import bcrypt from "bcryptjs";

const saltRounds = 12;

export const saltAndHashPassword = async (
  password: string
): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (err) {
    console.error(err);
    throw new Error("Error hashing password");
  }
};
