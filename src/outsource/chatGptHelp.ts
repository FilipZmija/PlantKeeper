import OpenAi from "openai";
const openai = new OpenAi({
  apiKey: process.env.OPENAI_API_KEY,
});

const plantInfo = {
  name: "Name",
  commonName: "Common name",
  availability: "Regular",
  lightTolerated: "Diffuse light ( Less than X lux / X fc)",
  lightIdeal: "Strong light ( X to X lux/X to X fc)",
  temperatureMax: 0,
  temperatureMin: 0,
  watering: "Water when soil is half dry & Can dry between watering",
  climat: "Tropical",
};

const responseToJson = (response: string) =>
  response.replace("```json\n", "").replace("\n```", "");

export const getPlantInfoPrompt = (name: string) =>
  "Provide information about " +
  name +
  " in the same style as this" +
  JSON.stringify(plantInfo) +
  "?" +
  "Only return json";

export const identifyPlantPrompt = () =>
  "Can you identify this plant and proivide me with information about this plant in the same style as this" +
  JSON.stringify(plantInfo) +
  "?" +
  "Make sure to return only json object such as provided one";

export const questionOpenAI = async (prompt: string) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });
  const message = response.choices[0].message.content;
  if (!message) return null;
  return JSON.parse(responseToJson(message));
};
export const indentifyPlantOpenAI = async (image: string) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: identifyPlantPrompt() },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 300,
    });

    const message = response.choices[0].message.content;
    console.log(response);
    if (!message) return null;
    return JSON.parse(responseToJson(message));
  } catch (error) {
    throw error;
  }
};
