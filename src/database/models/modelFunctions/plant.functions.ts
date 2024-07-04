import { Plant } from "../Plant.model.js";
import { Op, fn, col, where } from "@sequelize/core";
export const getPlantsBySubstringName = async (name: string) => {
  try {
    const plant = await Plant.findOne({
      where: {
        name: {
          [Op.substring]: name,
        },
      },
    });
    if (plant) return [plant];
    else return [];
  } catch (e: any) {
    console.log(e);
    return [];
  }
};

export const getPlantsBySubstringCommonName = async (name: string) => {
  try {
    const plant = await Plant.findOne({
      where: where(fn("LOWER", col("commonName")), {
        [Op.like]: `%${name.toLowerCase()}%`,
      }),
    });
    if (plant) return [plant];
    else return [];
  } catch (e: any) {
    console.log(e);
    return [];
  }
};

export const isPlantInDatabase = async (id: string, name: string) => {
  try {
    const existingPlant = await Plant.findOne({
      where: {
        [Op.or]: [
          { apiId: id },
          where(
            fn("REPLACE", fn("LOWER", col("name")), " ", ""),
            fn("REPLACE", name.toLowerCase(), " ", "")
          ),
        ],
      },
    });
    return !!existingPlant;
  } catch (e) {
    console.log(e);
    throw new Error("Could not establish if plant already exists");
  }
};
