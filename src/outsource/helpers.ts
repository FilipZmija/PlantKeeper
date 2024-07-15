import { readFileSync } from "node:fs";

export const delay = (time: number) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

export const getFileBlob = (path: string, type: string) => {
  try {
    const file = readFileSync(path);
    const fileBlob = new Blob([file], { type });
    return fileBlob;
  } catch (err) {
    console.error("Error reading the file:", err);
    return null;
  }
};

export const getFileBase64 = (path: string): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    try {
      const fileBuffer = readFileSync(path);
      const base64String = fileBuffer.toString("base64");
      resolve(base64String);
    } catch (err) {
      console.error("Error reading the file:", err);
      reject(null);
    }
  });
};
