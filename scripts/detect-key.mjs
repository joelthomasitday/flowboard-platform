import "dotenv/config";
const k = process.env.OPENAI_API_KEY;
if (k) {
    if (k.startsWith("sk-")) {
        console.log("DETECTED: OpenAI Key (starts with sk-)");
    } else if (k.startsWith("AIza")) {
        console.log("DETECTED: Google Gemini Key (starts with AIza)");
    } else {
        console.log("DETECTED: Unknown key format: " + k.substring(0, 4) + "...");
    }
} else {
    console.log("DETECTED: No key found in env");
}
