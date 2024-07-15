import { NextFunction, Request, Response } from "express";
import { User } from "../database/models/User.model.js";

export const validateIdentification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.user;
  const user = await User.findByPk(id);
  if (!user) return res.status(404).json({ message: "User not found" });
  const { powerIdentifications, role } = user;
  if (role === "admin") return next();
  if (role === "user" && powerIdentifications > 0) {
    user.powerIdentifications -= 1;
    await user.save();
    return next();
  }
  return res.status(429).json({
    message:
      "You are not allowed to power identify! If you wish to do that please contact admin or wait for the next day",
  });
};
