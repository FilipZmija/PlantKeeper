import {
  CipherGCMTypes,
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from "node:crypto";
const algorithm = "aes-256-cbc" as CipherGCMTypes;
const key = process.env.CRYPTO_SECRET;
const iv = Buffer.from(process.env.CRYPTO_IV, "hex");
export const encrypt = (email: string) => {
  const cipher = createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(email, "utf8", "hex");
  encrypted += cipher.final("hex");
  return { iv: iv.toString("hex"), encryptedData: encrypted };
};

export const decrypt = (encryptedData: string) => {
  const decipher = createDecipheriv(
    algorithm,
    Buffer.from(key),
    Buffer.from(iv.toString("hex"), "hex")
  );
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};
