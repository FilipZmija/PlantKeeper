import express from "express";
import http from "http";
import dotenv from "dotenv";
import { sequelize } from "./database/init.js";
import cors from "cors";
import user from "./routes/user.js";
import plant from "./routes/plants.js";
import ownedplant from "./routes/ownedPlants.js";
import { ServerSocket } from "./sockets/socket.js";
import { proceedPlantDataCollecting } from "./outsource/data.js";
import { indentifyPlant } from "./outsource/plantsRecognition.js";
import { getFileName } from "./outsource/helpers.js";
import { uploadBlob } from "./outsource/azureBlobStorage.js";

dotenv.config();
const app = express();
const server = http.createServer(app);

new ServerSocket(server);

app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);
app.use(express.json({ limit: "100mb" }));
app.use("/user", user);
app.use("/plants", plant);
app.use("/ownedplant", ownedplant);

const sequelizes = await sequelize();
await sequelizes.sync();
// await proceedPlantDataCollecting();

server.listen(process.env.PORT, () =>
  console.log(`Listening on port ${process.env.PORT}`)
);
