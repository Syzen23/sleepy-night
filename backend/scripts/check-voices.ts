import * as dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.CARTESIA_API_KEY;

async function checkVoices() {
  try {
    const response = await fetch("https://api.cartesia.ai/voices", {
      headers: {
        "X-API-Key": apiKey || '',
        "Cartesia-Version": "2024-06-10"
      }
    });
    const data: any = await response.json();
    const feminineVoices = data.filter((v: any) => v.gender === 'feminine');
    console.log("=== Female Voices ===");
    feminineVoices.forEach((v: any) => {
      console.log(`Name: ${v.name}, ID: ${v.id}, Langs: ${v.supported_languages || v.language}`);
    });
  } catch (e: any) {
    console.error("Error:", e.message);
  }
}

checkVoices();
