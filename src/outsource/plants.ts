import axios, { AxiosResponse } from "axios";
import { ILitePlantApiData, IPlantApiData, isIPlantApiData } from "./types.js";
import { delay } from "./helpers.js";
import { Plant } from "../database/models/Plant.model.js";
import { isPlantInDatabase } from "../database/models/modelFunctions/plant.functions.js";
const headers = {
  "x-rapidapi-key": process.env.PLANT_API_HOSTAPI_KEY,
  "x-rapidapi-host": process.env.PLANT_API_HOST,
};

export const fetchLiteAllPlants = async (): Promise<ILitePlantApiData[]> => {
  try {
    const response: AxiosResponse<ILitePlantApiData[]> = await axios.get(
      `${process.env.PLANT_API_URL}/all-lite`,
      {
        headers,
      }
    );
    return response.data;
  } catch (e: any) {
    console.error("Error getting plants: ", e.message || e);
    throw new Error("Error getting plants: " + e.message || e);
  }
};

export const getSinglePlant = async (id: string, name: string) => {
  try {
    const existingPlant = await isPlantInDatabase(id, name);
    if (existingPlant) return false;
    const response: AxiosResponse<IPlantApiData> = await axios.get(
      `${process.env.PLANT_API_URL}/id/${id}`,
      {
        headers,
      }
    );
    console.log(response.status);
    return response.data;
  } catch (e: any) {
    throw new Error("Error getting plant: " + e);
  }
};

export const fetchAllPlants = async () => {
  try {
    const allPlants = await fetchLiteAllPlants();
    const allPlantsExtended: IPlantApiData[] = [];
    for (let i = 0; i < allPlants.length; i += 10) {
      try {
        const array = allPlants.slice(i, i + 10);
        const plant = (
          await Promise.all(
            array.map(async (item) =>
              allPlantsExtended.findIndex(
                (plant) => plant["Latin name"] === item["Latin name"]
              ) === -1
                ? await getSinglePlant(item.id, item["Latin name"])
                : false
            )
          )
        ).filter(isIPlantApiData);
        allPlantsExtended.push(...plant);
        await delay(500);
      } catch (batchError: any) {
        console.error(
          "Error processing batch: ",
          batchError.message || batchError
        );
        continue;
      }
    }
    return allPlantsExtended;
  } catch (e: any) {
    console.log(e);
    throw new Error("Error fetching all plants: " + e.message || e);
  }
};

export const uploadToDatabase = async (plantApiData: IPlantApiData[]) => {
  try {
    const remadePlants = plantApiData.map((plant) => {
      const {
        id: apiId,
        "Latin name": name,
        Avaibility: availability,
        "Light tolered": lightTolerated,
        "Light ideal": lightIdeal,
        "Temperature min": temperatureMin,
        "Temperature max": temperatureMax,
        "Common name": commonName,
        Watering: watering,
        Climat: climat,
      } = plant;

      return {
        apiId,
        name,
        commonName: commonName?.join(", "),
        availability,
        lightTolerated,
        lightIdeal,
        temperatureMin: temperatureMin?.C,
        temperatureMax: temperatureMax?.C,
        watering,
        climat,
      };
    });
    const plants = await Plant.bulkCreate(remadePlants);
    return plants;
  } catch (e: any) {
    console.log(e);
    console.error("Error uploading plant to database: ", e.message || e);
    return [];
  }
};
