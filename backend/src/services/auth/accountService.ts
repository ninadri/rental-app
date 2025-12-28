import User, { IUser } from "../../models/User";

export interface UpdateAccountPayload {
  name?: string;
  email?: string;
}

export interface UpdateAccountResult {
  user: IUser;
  emailChanged: boolean;
}

export const updateUserAccount = async (
  userId: string,
  payload: UpdateAccountPayload
): Promise<UpdateAccountResult> => {
  const { name, email } = payload;

  if (!name && !email) {
    throw new Error("NO_FIELDS_PROVIDED");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  let emailChanged = false;

  // Update name if provided
  if (typeof name === "string" && name.trim().length > 0) {
    user.name = name.trim();
  }

  // Update email if provided and different
  if (typeof email === "string" && email.trim().length > 0) {
    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail !== user.email) {
      const existingUser = await User.findOne({ email: normalizedEmail });

      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        throw new Error("EMAIL_IN_USE");
      }

      user.email = normalizedEmail;
      emailChanged = true;
    }
  }

  await user.save();

  return { user, emailChanged };
};
