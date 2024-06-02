import { fetchAllPlants, uploadToDatabase } from "./plants.js";

export const proceedPlantDataCollecting = async () => {
  try {
    const allPlants = await fetchAllPlants();
    const plants = await uploadToDatabase(allPlants);
    return allPlants.length === plants.length;
  } catch (e) {
    console.log(e);
    return false;
  }
};
