import { BlobServiceClient } from "@azure/storage-blob";
import path from "path";
import { v4 as uuidv4 } from "uuid";
const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);
const containerName = "img";

export const uploadBlob = async (filePath: string) => {
  const fileExtension = path.extname(filePath);
  const blobName = uuidv4() + fileExtension;
  const containerClient = blobServiceClient.getContainerClient(containerName);
  try {
    const exists = await containerClient.exists();
    if (!exists) {
      await containerClient.create();
    }
  } catch (e) {
    console.error(e);
    throw new Error("Failed to create container");
  }

  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  try {
    await blockBlobClient.uploadFile(filePath);
  } catch (e) {
    console.error(e);
    throw new Error("Failed to upload file");
  }
  return blockBlobClient.url;
};
