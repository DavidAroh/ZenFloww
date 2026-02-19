
import { GoogleGenAI } from "@google/genai";
import fs from 'fs';

const apiKey = "AIzaSyAoRmq3LdQE7QKiHQYNAVQI9KBtul_bAvI";
const ai = new GoogleGenAI({ apiKey });

async function listModels() {
  try {
    const response = await ai.models.list();
    // Serialize with circular reference handling if needed, or just standard
    const text = JSON.stringify(response, null, 2);
    fs.writeFileSync('models_output.json', text);
    console.log("Wrote models to models_output.json");
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();
