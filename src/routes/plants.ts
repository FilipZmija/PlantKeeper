import express from "express";
import { indentifyPlant } from "../outsource/plantsRecognition.js";
import { getFileName } from "../outsource/helpers.js";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { existsSync, mkdirSync } from "node:fs";
import { Plant } from "../database/models/Plant.model.js";
import { getPlantsBySubstringName } from "../database/models/modelFunctions/plant.functions.js";
import { addIdentifiedPlantToDatabase } from "../outsource/plantsRecognition.js";
import { v4 as uuidv4 } from "uuid";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadsDir = __dirname + "/uploads";

const router = express.Router();
router.use(express.json({ limit: "10mb" }));
router.use((req, res, next) => {
  next();
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/identify", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Bad request" });
  const { path, mimetype, filename } = req.file;

  const file = getFileName(path, mimetype);
  if (!file) return res.status(400).json({ message: "Bad request" });

  try {
    const identifiction = await indentifyPlant(file);
    if (identifiction) {
      const result: Plant[] = [];
      const genus = identifiction.results[0].species.genus.scientificName;
      const species =
        identifiction.results[0].species.scientificNameWithoutAuthor;

      const speciesPlant = await getPlantsBySubstringName(species);
      result.push(...speciesPlant);

      if (result.length === 0) {
        const genusPlant = await getPlantsBySubstringName(genus);
        result.push(...genusPlant);
      }

      if (result.length === 0) {
        const newPlant = await addIdentifiedPlantToDatabase(
          identifiction.results[0]
        );
        if (newPlant) result.push(newPlant);
      }

      res.status(200).json({ result, filename });
    } else res.status(404).json({ message: "Plant has not been identified" });
  } catch (e) {
    console.error(e);
    res.status(404).json({ message: "Plant has not been identified", e });
  }
});

router.get("/", async (req, res) => {
  try {
    const plants = await Plant.findAll();
    if (plants) res.status(200).json(plants);
    else res.status(404).json({ message: "Plants not found" });
  } catch (e) {
    console.error(e);
    res.status(404).json({ message: "Plants not found", e });
  }
});

router.post("/", async (req, res) => {
  const { name, ...rest } = req.body;

  if (!name) return res.status(400).json({ message: "Bad request" });
  try {
    const plant = await Plant.create({
      name,
      ...rest,
    });
    res.status(201).json(plant);
  } catch (e: any) {
    console.error(e);
    res.status(400).json({ message: e.message });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ message: "Bad request" });
  try {
    const plant = await Plant.findByPk(id);
    if (plant) res.status(200).json(plant);
    else res.status(404).json({ message: "Plant not found" });
  } catch (e) {
    console.error(e);
    res.status(404).json({ message: "Plant not found", e });
  }
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ message: "Bad request" });
  try {
    const plant = await Plant.findByPk(id);
    if (plant) {
      await plant.update(req.body);
      res.status(200).json(plant);
    } else res.status(404).json({ message: "Plant not found" });
  } catch (e) {
    console.error(e);
    res.status(404).json({ message: "Plant not found", e });
  }
});

export default router;
