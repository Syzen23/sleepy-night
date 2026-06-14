import * as dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.CARTESIA_API_KEY;

async function checkModels() {
  const response = await fetch("https://api.cartesia.ai/models", {
    headers: {
      "X-API-Key": apiKey || '',
      "Cartesia-Version": "2024-06-10"
    }
  });
  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}

checkModels();
