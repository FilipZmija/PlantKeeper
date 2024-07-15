import express from "express";
import bcrypt from "bcrypt";
import { User } from "../database/models/User.model.js";
import { Response, Request } from "express";
import { validateTokenApi, createToken } from "../auth/JWT.js";
import { decrypt, encrypt } from "../auth/encryptData.js";
import { Op, or } from "@sequelize/core";
import { sendEmail } from "../emails/sendEmail.js";
const router = express.Router();

router.use(express.json({ limit: "10mb" }));
router.use((req, res, next) => {
  next();
});

router.post("/register", async (req, res) => {
  const {
    name,
    password,
    email,
  }: { name: string; password: string; email: string } = req.body;
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  console.log(ip);
  const encryptedEmail = email
    .split("@")
    .map((el) => encrypt(el).encryptedData)
    .join("@");

  try {
    const user = await User.findOne({ where: { name } });
    if (user) {
      res.status(400).json({ message: "User with this name already exists" });
      return;
    }
    const userEmail = await User.findOne({ where: { email: encryptedEmail } });
    if (userEmail) {
      res.status(400).json({ message: "User with this email already exists" });
      return;
    }
    const hash = await bcrypt.hash(password, 5);
    const newUser = await User.create({
      name,
      active: false,
      email: encryptedEmail,
      password: hash,
      powerIdentifications: 10,
    });
    const code = encrypt(newUser.id.toString()).encryptedData;
    const confirmationUrl = `http://localhost:3001/user/confirm?code=${code}`;
    const confirmationButton = `<a href="${confirmationUrl}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Confirm account</a>`;
    await sendEmail(email, confirmationUrl, confirmationButton);
    res.status(200).json({
      message: "You have registered succesfully",
    });
  } catch (e) {
    console.error(e);
    res.status(404).json({ message: "User has not been registered", e });
  }
});

router.get(
  "/confirm",
  async (req: Request<any, any, any, { code: string }>, res) => {
    const { code } = req.query;
    const id = decrypt(code);
    if (!id) return res.status(404).json({ message: "Invalid code" });
    try {
      const user = await User.findByPk(id);
      if (!user)
        return res.status(404).json({ message: "User does not exist" });
      user.active = true;
      await user.save();
      res.status(200).send("<h1>User has been confirmed</h1>");
    } catch (e) {
      res.status(400).json({ e });
    }
  }
);

router.get("/confirm", async (req, res) => {
  const { code } = req.query;
});
router.post("/login", async (req, res) => {
  const { name, password }: { name: string; password: string } = req.body;
  try {
    const user = await User.findOne({ where: { name: name } });
    if (!user) return res.status(404).json({ message: "User does not exist" });
    const hashPassword = await bcrypt.compare(password, user.password);
    if (!hashPassword)
      return res.status(400).json({ message: "Invalid password" });
    if (!user.active)
      return res.status(400).json({ message: "User is not active" });
    const accessToken = createToken(user);
    res.json({
      message: "User logged in successfully",
      accessToken: accessToken,
      name,
      id: user.id,
    });
  } catch (e) {
    console.error(e);
    res
      .status(404)
      .json({ message: "Something went wrong, please try again", e });
  }
});

router.get("/data", validateTokenApi, async (req: Request, res: Response) => {
  const { id }: { id: number } = req.user;
  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(404).json({ message: "User does not exist" });
    }
  } catch (e) {
    res.status(400).json({ e });
  }
});

export default router;
