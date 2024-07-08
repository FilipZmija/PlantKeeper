import OpenAi from "openai";
const openai = new OpenAi({
  apiKey: process.env.OPENAI_API_KEY,
});

const plantInfo = {
  name: "Monstera deliciosa",
  commonName: "Splitleaf Philodendron, Mexican Breadfruit",
  availability: "Regular",
  lightTolerated: "Diffuse light ( Less than X lux / X fc)",
  lightIdeal: "Strong light ( X to X lux/X to X fc)",
  temperatureMax: 0,
  temperatureMin: 0,
  watering: "Water when soil is half dry & Can dry between watering",
  climat: "Tropical",
};

export const getPlantInfoPrompt = (name: string) =>
  "Can you proivide me with information about " +
  name +
  " in the same style as this" +
  JSON.stringify(plantInfo) +
  "?" +
  "Make sure to return only json object such as provided one";

export const questionOpenAI = async (prompt: string) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });
  const message = response.choices[0].message.content;
  if (message) {
    const jsonString = message.replace("```json\n", "").replace("\n```", "");
    return JSON.parse(jsonString);
  } else return null;
};
