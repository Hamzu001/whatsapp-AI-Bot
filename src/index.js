import "dotenv/config.js";
import express from "express";
import qrcode from "qrcode-terminal";
import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import geminiAiConfig from "./Gemini-AI-Config.js";

const app = express();
const PORT = process.env.PORT || 3000;

// export const client = new Client();
// use this to store the session of your whatspp account
export const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    handleSIGINT: false,
    args: ["--na-sandbox", "--disable-setuid-sandbox"],
  },
  webVersionCache: {
    type: "remote",
    remotePath:
      "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
  },
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("message", async (message) => {
  geminiAiConfig(message.body).then((msg) => message.reply(msg));
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.initialize();

app.listen(PORT, () => {
  console.log("server running in port", PORT);
});
