import { existsSync, mkdir } from "node:fs";

export const createFolder = (path: string) => {
  return new Promise((resolve, reject) => {
    if (!existsSync(path)) {
      mkdir(path, { recursive: true }, (err) => {
        if (err) {
          console.error("Error creating directory:", err);
          reject(false);
        } else {
          console.log("Directory created successfully");
          resolve(true);
        }
      });
    } else {
      console.log("Directory already exists");
      resolve(false);
    }
  });
};
