import express from "express";
import {
  addOpenAIIdentifiedPlantToDatabase,
  indentifyPlant,
} from "../outsource/plantsRecognition.js";
import { getFileBase64, getFileBlob } from "../outsource/helpers.js";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { existsSync, mkdirSync } from "node:fs";
import { Plant } from "../database/models/Plant.model.js";
import {
  getPlantsBySubstringCommonName,
  getPlantsBySubstringName,
} from "../database/models/modelFunctions/plant.functions.js";
import { addIdentifiedPlantToDatabase } from "../outsource/plantsRecognition.js";
import { v4 as uuidv4 } from "uuid";
import {
  getPlantInfoPrompt,
  indentifyPlantOpenAI,
  questionOpenAI,
} from "../outsource/chatGptHelp.js";
import { validateTokenApi } from "../auth/JWT.js";
import { validateIdentification } from "../permissions/middleware.js";
import { shrinkImage } from "../helpers/images.js";
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

  const file = getFileBlob(path, mimetype);
  if (!file) return res.status(400).json({ message: "Bad request" });

  try {
    const identifiction = await indentifyPlant(file);
    if (identifiction) {
      const result: Plant[] = [];
      const common = identifiction.results[0].species.commonNames[0];
      const species =
        identifiction.results[0].species.scientificNameWithoutAuthor;
      console.log(identifiction.results[1]);
      const speciesPlant = await getPlantsBySubstringName(species);
      result.push(...speciesPlant);

      if (result.length === 0) {
        const genusPlant = await getPlantsBySubstringCommonName(common);
        console.log(genusPlant);
        result.push(...genusPlant);
      }

      if (result.length === 0) {
        const plantPrompt = getPlantInfoPrompt(species);
        const openAIResponse = await questionOpenAI(plantPrompt);
        console.log(openAIResponse);
        if (openAIResponse) {
          const parsedPlant = await addOpenAIIdentifiedPlantToDatabase(
            openAIResponse
          );
          if (parsedPlant) result.push(parsedPlant);
        } else {
          const newPlant = await addIdentifiedPlantToDatabase(
            identifiction.results[0]
          );
          if (newPlant) result.push(newPlant);
        }
      }

      res.status(200).json({ result, filename });
    } else res.status(404).json({ message: "Plant has not been identified" });
  } catch (e) {
    console.error(e);
    res.status(404).json({ message: "Plant has not been identified", e });
  }
});

router.post(
  "/identify/openai",
  validateTokenApi,
  validateIdentification,
  upload.single("image"),
  async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "Bad request" });
    const { path, filename, destination } = req.file;
    try {
      const shrinked = await shrinkImage(
        path,
        destination + "/shrinked/",
        filename
      );
      const file = await getFileBase64(shrinked);
      if (!file) return res.status(400).json({ message: "Bad request" });
      const identifiedPlant = await indentifyPlantOpenAI(file);
      if (identifiedPlant) res.status(200).json({ identifiedPlant, filename });
      else res.status(404).json({ message: "Plant has not been identified" });
    } catch (e) {
      console.error(e);
      res.status(404).json({ message: "Plant has not been identified", e });
    }
  }
);

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
