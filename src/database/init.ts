import { Sequelize } from "@sequelize/core";
import { importFilesFromFolder } from "./helperFunctions.js";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize({
  dialect: process.env.DIALECT,
  storage: process.env.STORAGE,
  models: await importFilesFromFolder("/models"),
});
