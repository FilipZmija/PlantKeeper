import { readFileSync } from "node:fs";

export const delay = (time: number) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

export const getFileName = (path: string, type: string) => {
  const file = readFileSync(path);
  const fileBlob = new Blob([file], { type });
  return fileBlob;
};
