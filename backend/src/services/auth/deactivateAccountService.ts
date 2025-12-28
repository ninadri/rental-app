import User, { IUser } from "../../models/User";

export const deactivateTenantAccountByAdmin = async (
  targetUserId: string
): Promise<IUser> => {
  const user = await User.findById(targetUserId);

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  // Only allow deactivating tenants
  if (user.role !== "tenant") {
    throw new Error("NOT_TENANT");
  }

  // Idempotent: if already inactive, just return as-is
  if (user.isActive === false) {
    return user;
  }

  user.isActive = false;
  user.deactivatedAt = new Date();

  await user.save();

  return user;
};
