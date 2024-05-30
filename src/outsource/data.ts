import { fetchAllPlants, uploadToDatabase } from "./plants.js";

export const proceedPlantDataCollecting = async () => {
  const allPlants = await fetchAllPlants();
  const plants = await uploadToDatabase(allPlants);
  return allPlants.length === plants.length;
};
