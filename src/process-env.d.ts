declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      NODE_ENV: string;
      DIALECT: "sqlite";
      STORAGE: string;
      ORIGIN: string;
      SECRET_TOKEN: string;
      CLIENT_URI: string;
      PLANT_API_URL: string;
      PLANT_API_KEY: string;
      PLANT_API_HOST: string;
      PLANT_INDENTIFICATION_API_URL: string;
      PLANT_INDENTIFICATION_API_KEY: string;
      AZURE_STORAGE_CONNECTION_STRING: string;
    }
  }
}
export {};
