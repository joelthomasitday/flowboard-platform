import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const API_KEY = process.env.OPENAI_API_KEY;

async function check() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();
        console.log("STATUS:", response.status);
        if (data.models) {
            console.log("MODELS:", data.models.map(m => m.name));
        } else {
            console.log("ERROR:", data);
        }
    } catch (e) {
        console.error("FAIL:", e);
    }
}
check();
