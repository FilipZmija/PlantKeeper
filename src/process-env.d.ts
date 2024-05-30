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
      API_URL: string;
      API_KEY: string;
      API_HOST: string;
    }
  }
}
export {};
