import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User";
import { updateUserAccount } from "../services/auth/accountService";
import { AuthRequest } from "../middleware/authMiddleware";
import { deactivateTenantAccountByAdmin } from "../services/auth/deactivateAccountService";

const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    if (role !== "admin" && role !== "tenant") {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.create({ name, email, password, role });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id.toString()),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (user.isActive === false) {
      return res
        .status(403)
        .json({ message: "Account is deactivated. Please contact support." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id.toString()),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(200)
        .json({ message: "If an account exists, a reset link was sent." });
    }

    if (user.isActive === false) {
      return res
        .status(200)
        .json({ message: "If an account exists, a reset link was sent." });
    }

    // Check cooldown BEFORE generating new token
    if (
      user.resetPasswordExpires &&
      user.resetPasswordExpires > new Date() &&
      user.resetPasswordToken
    ) {
      return res.status(429).json({
        message:
          "A reset link was recently requested. Please wait before trying again.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash before saving to DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save hashed token + expiration
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

    // Return token for testing
    return res.status(200).json({
      message: "Password reset token generated.",
      resetToken, // only for testing until SendGrid added
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Hash token to compare with DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find matching user
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Token is invalid or has expired" });
    }

    // Set new password
    user.set({ password });
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    // AUTO LOGIN AFTER RESET
    const authToken = generateToken(user._id.toString());

    return res.status(200).json({
      message: "Password reset successful",
      token: authToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Server error resetting password" });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id; // from protect middleware
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "oldPassword and newPassword are required" });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify old password
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Set new password
    user.set({ password: newPassword });
    await user.save();

    // Auto-login (generate new JWT)
    const token = generateToken(user._id.toString());

    return res.status(200).json({
      message: "Password updated successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Server error updating password" });
  }
};

export const updateAccount = async (req: Request, res: Response) => {
  try {
    const userFromReq = (req as any).user; // set by protect middleware
    const userId = userFromReq?._id;

    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { name, email } = req.body;

    // Require at least one field
    if (name === undefined && email === undefined) {
      return res.status(400).json({
        message: "Please provide at least one field to update (name or email)",
      });
    }

    // Basic type checks
    if (name !== undefined && typeof name !== "string") {
      return res.status(400).json({ message: "Name must be a string" });
    }

    if (email !== undefined && typeof email !== "string") {
      return res.status(400).json({ message: "Email must be a string" });
    }

    // Use the service to perform the actual update
    const { user, emailChanged } = await updateUserAccount(userId.toString(), {
      name,
      email,
    });

    // Refresh JWT like login / changePassword / resetPassword
    const token = generateToken(user._id.toString());

    return res.status(200).json({
      message: "Account updated successfully",
      emailChanged,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error: any) {
    if (error?.message === "NO_FIELDS_PROVIDED") {
      return res.status(400).json({
        message: "Please provide at least one field to update (name or email)",
      });
    }

    if (error?.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "User not found" });
    }

    if (error?.message === "EMAIL_IN_USE") {
      return res.status(400).json({ message: "Email is already in use" });
    }

    console.error("Update account error:", error);
    return res
      .status(500)
      .json({ message: "Server error updating account", error });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    // protect middleware should have set req.user
    if (!req.user?._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    return res.status(200).json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return res
      .status(500)
      .json({ message: "Server error fetching profile", error });
  }
};

export const adminDeactivateTenant = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    // adminOnly middleware should enforce role, but we double-guard here
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }

    const { id } = req.params; // tenant id in URL

    if (!id) {
      return res.status(400).json({ message: "Tenant ID is required" });
    }

    const user = await deactivateTenantAccountByAdmin(id);

    return res.status(200).json({
      message: "Tenant account deactivated successfully",
      tenantId: user._id,
      deactivatedAt: user.deactivatedAt,
    });
  } catch (error: any) {
    if (error?.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "Tenant not found" });
    }

    if (error?.message === "NOT_TENANT") {
      return res
        .status(400)
        .json({ message: "Only tenant accounts can be deactivated" });
    }

    console.error("Admin deactivate tenant error:", error);
    return res.status(500).json({
      message: "Server error deactivating tenant account",
      error,
    });
  }
};
