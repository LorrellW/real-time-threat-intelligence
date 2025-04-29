// app/utils/cache.server.ts
import Redis from "ioredis";
import axios from "axios";

const redis = new Redis(); // Configure as needed

async function fetchFromOSINT(ip: string) {
  // Replace with your actual external API call logic
  const response = await axios.get(`https://external-api.com/threat?ip=${ip}`);
  return response.data;
}

export async function getThreatData(ip: string) {
  const cachedData = await redis.get(ip);
  if (cachedData) {
    return JSON.parse(cachedData);
  } else {
    const data = await fetchFromOSINT(ip);
    await redis.set(ip, JSON.stringify(data), "EX", 3600); // Cache for 1 hour
    return data;
  }
}
