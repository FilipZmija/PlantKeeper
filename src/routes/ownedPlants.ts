import Router from "express";
import { OwnedPlant } from "../database/models/OwnedPlant.model.js";
import { uploadBlob } from "../outsource/azureBlobStorage.js";
import { validateTokenApi } from "../auth/JWT.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { Plant } from "../database/models/Plant.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadsDir = __dirname + "/uploads/";

const router = Router();

router.use((req, res, next) => {
  next();
});

router.post("/add", async (req, res) => {
  const {
    name,
    filename,
    id: plantId,
    lastWatered,
    lastTransplanted,
    desiredMoisture,
    wateringType,
  } = req.body;
  const userId = 1;
  console.log(!filename, !plantId);
  if (!filename || !plantId) res.status(400).json({ message: "Bad request" });
  try {
    const imageUrl = await uploadBlob(uploadsDir + filename);
    const { id } = await OwnedPlant.create({
      name,
      plantId,
      image: imageUrl,
      lastWatered,
      lastTransplanted,
      desiredMoisture,
      wateringType,
      userId,
    });
    const plant = await OwnedPlant.findByPk(id, { include: Plant });
    res.status(201).json(plant);
  } catch (e: any) {
    console.log(e);
    res.status(400).json({ message: e.message });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ message: "Bad request" });
  try {
    const plant = await OwnedPlant.findByPk(id, { include: Plant });
    if (plant) res.status(200).json(plant);
    else res.status(404).json({ message: "Plant not found" });
  } catch (e: any) {
    console.error(e);
    res.status(404).json({ message: "Plant not found", e });
  }
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ message: "Bad request" });
  try {
    const plant = await OwnedPlant.findByPk(id);
    if (plant) {
      await plant.update(req.body);
      res.status(200).json(plant);
    } else res.status(404).json({ message: "Plant not found" });
  } catch (e: any) {
    console.error(e);
    res.status(404).json({ message: "Plant not found", e });
  }
});

router.get("/user/:id", async (req, res) => {
  const userId = req.params.id;
  if (!userId) return res.status(400).json({ message: "Bad request" });
  try {
    const plants = await OwnedPlant.findAll({
      where: { userId },
      include: Plant,
    });
    if (plants) res.status(200).json(plants);
    else res.status(404).json({ message: "Plants not found" });
  } catch (e: any) {
    console.error(e);
    res.status(404).json({ message: "Plants not found", e });
  }
});

export default router;
