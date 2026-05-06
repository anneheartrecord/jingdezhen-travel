import { GoogleGenAI } from "@google/genai";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, resolve } from "node:path";
import { ProxyAgent, setGlobalDispatcher } from "undici";

const assetRequests = [
  {
    fileName: "porcelain-map.png",
    prompt:
      "Create a fresh blue-and-white porcelain style illustrated mini map for a Jingdezhen travel website. Cute but practical, top-down/isometric hybrid, porcelain white background, cobalt blue linework, celadon green hills, small warm kiln-orange accents. Show abstract city core, Sanbao valley, Fuliang countryside, and Yaoli old town as visual clusters. Do not include any letters, labels, words, numbers, Chinese characters, Latin text, captions, signage, watermark, or UI mockup.",
  },
  {
    fileName: "traveler-character.png",
    prompt:
      "Create a cute tiny traveler character for a Jingdezhen interactive map. Blue-and-white porcelain inspired outfit, friendly full-body mascot, clean front view, generous padding, porcelain white background, no text, no watermark, suitable for a web route animation.",
  },
  {
    fileName: "share-cover.png",
    prompt:
      "Create a Xiaohongshu-friendly cover background for a Chinese Jingdezhen travel route planner. Fresh blue-and-white porcelain illustration style, Jingdezhen ceramics, map route dots, tiny traveler, soft porcelain white, cobalt blue, celadon green, kiln-orange accents. Leave a clean empty center area where real text can be overlaid later. Do not include any letters, labels, words, numbers, Chinese characters, Latin text, captions, signage, or watermark.",
  },
];

/**
 * Configures Node fetch to use the local proxy when present.
 */
function configureProxy() {
  const proxyUrl = process.env.HTTPS_PROXY ?? process.env.https_proxy ?? process.env.HTTP_PROXY ?? process.env.http_proxy;
  if (!proxyUrl) {
    return;
  }

  setGlobalDispatcher(new ProxyAgent(proxyUrl));
  console.log("using proxy from environment");
}

/**
 * Loads one environment variable from shell, local env files, or Codex private config.
 *
 * @param variableNames - Accepted environment variable names.
 * @returns The first matching value, or undefined when absent.
 */
function loadSecret(variableNames) {
  for (const variableName of variableNames) {
    const value = process.env[variableName];
    if (value) {
      return value.trim();
    }
  }

  const configPaths = [
    resolve(".env.local"),
    resolve(".env"),
    resolve(homedir(), ".codex", "CODEX.local.md"),
  ];

  for (const configPath of configPaths) {
    if (!existsSync(configPath)) {
      continue;
    }

    const configText = readFileSync(configPath, "utf8");
    for (const variableName of variableNames) {
      const match = configText.match(new RegExp(`${variableName}\\s*[:=]\\s*([^\\s]+)`));
      if (match?.[1]) {
        return match[1].trim();
      }
    }
  }

  return undefined;
}

/**
 * Extracts the first image part from a Gemini response.
 *
 * @param response - Gemini SDK response object.
 * @returns Base64 encoded image data and mime type.
 */
function extractImagePart(response) {
  const parts = response.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    if (part.inlineData?.data && part.inlineData.mimeType) {
      return {
        base64Data: part.inlineData.data,
        mimeType: part.inlineData.mimeType,
      };
    }
  }

  return undefined;
}

/**
 * Generates one image asset and writes it into the public assets directory.
 *
 * @param aiClient - Google GenAI SDK client.
 * @param fileName - Output file name.
 * @param prompt - Image generation prompt.
 * @returns Promise that resolves after the image is written.
 */
async function generateAsset(aiClient, fileName, prompt) {
  const response = await aiClient.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: prompt,
  });
  const imagePart = extractImagePart(response);
  if (!imagePart) {
    throw new Error(`No image was returned for ${fileName}.`);
  }

  const outputPath = resolve("public", "assets", fileName);
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, Buffer.from(imagePart.base64Data, "base64"));
  console.log(`generated ${fileName} (${imagePart.mimeType})`);
}

/**
 * Runs the nano banana asset generation workflow.
 *
 * @returns Promise that resolves when all assets are generated.
 */
async function main() {
  configureProxy();
  const apiKey = loadSecret(["GEMINI_API_KEY", "GOOGLE_API_KEY", "GOOGLE_GENERATIVE_AI_API_KEY"]);
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY, GOOGLE_API_KEY, or GOOGLE_GENERATIVE_AI_API_KEY.");
  }

  const aiClient = new GoogleGenAI({ apiKey });
  for (const request of assetRequests) {
    await generateAsset(aiClient, request.fileName, request.prompt);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
