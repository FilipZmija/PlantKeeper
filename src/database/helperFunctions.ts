import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { ModelStatic } from "@sequelize/core";

//This function imports all models from certain file, in order it to work model name needs to be *.Model.ts where * is the name of the actual class inside then export will work
//otherwise it need to be export default, then the * can be any name.
export async function importFilesFromFolder(relativeFolderPath: string) {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const files = fs.readdirSync(path.join(__dirname, relativeFolderPath));
  const importedModules = await Promise.all(
    files
      .filter((file) => file.endsWith(".model.js"))
      .map(async (file) => {
        const modulePath = path.join(relativeFolderPath, file);
        const modelName = file.split(".")[0];
        try {
          const module: { [modelName: string | "default"]: ModelStatic } =
            await import("./" + modulePath);

          const model: { [modelName: string]: ModelStatic } = {
            [modelName]: module[modelName],
          };
          return model[modelName] || module["default"];
        } catch (error) {
          console.error("Error importing module:", error);
          throw error;
        }
      })
  );

  return importedModules;
}
