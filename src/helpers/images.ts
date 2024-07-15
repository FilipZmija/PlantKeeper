import sharp from "sharp";
import { createFolder } from "./files.js";

export const shrinkImage = (
  path: string,
  outPath: string,
  filename: string
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      await createFolder(outPath);
      sharp(path)
        .resize(200)
        .toFile(outPath + filename, (err) => {
          if (err) {
            reject(err);
          } else resolve(outPath + filename);
        });
    } catch (e) {
      reject(e);
    }
  });
};
