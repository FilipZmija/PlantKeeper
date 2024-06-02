import axios, { AxiosResponse } from "axios";
import { IIdentificationPlantApiData, IIdentifiedPlant } from "./types.js";
import { Plant } from "../database/models/Plant.model.js";
export const indentifyPlant = async (image: Blob) => {
  const formData = new FormData();
  formData.append("images", image);
  try {
    const now = performance.now();
    const response: AxiosResponse<IIdentificationPlantApiData> =
      await axios.post(
        `${process.env.PLANT_INDENTIFICATION_API_URL}/v2/identify/all?api-key=${process.env.PLANT_INDENTIFICATION_API_KEY}`,
        formData
      );
    console.log(performance.now() - now);
    return response.data;
  } catch (e: any) {
    console.log(e);
    console.error("Error indentifying plant: ", e.message || e);
  }
};

export const addIdentifiedPlantToDatabase = async (
  identifiedPlant: IIdentifiedPlant
) => {
  const name = identifiedPlant.species.scientificNameWithoutAuthor;
  const commonName = identifiedPlant.species.commonNames.join(", ");
  const plant = await Plant.create({ name, commonName });
  return plant;
};
