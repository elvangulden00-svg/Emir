// lib/gemini.ts
import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY ortam değişkeni tanımlı değil. Lütfen sunucu ortamında anahtarı sağlayın."
    );
  }

  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  return aiInstance;
}

export function formatGeminiError(err: unknown): string {
  if (!err) return "Bilinmeyen bir hata oluştu.";
  const msg = err instanceof Error ? err.message : String(err);

  if (
    msg.includes("503") ||
    msg.includes("UNAVAILABLE") ||
    msg.includes("high demand")
  ) {
    return "Yapay zekâ model sunucularında anlık yüksek talep yoğunluğu yaşanıyor (503). Sistem otomatik olarak yeniden denedi ancak yoğunluk sürüyor; lütfen birkaç saniye bekleyip 'Tekrar Dene' düğmesine basınız.";
  }
  if (msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED")) {
    return "İstek sınırı aşıldı (429). Lütfen kısa bir süre bekleyip tekrar deneyiniz.";
  }
  if (msg.includes("API_KEY") || msg.includes("api_key")) {
    return "API anahtarı doğrulanırken bir sorun oluştu.";
  }
  return msg;
}

export async function generateContentWithRetry(
  params: Parameters<GoogleGenAI["models"]["generateContent"]>[0],
  maxRetries = 3
) {
  const ai = getGeminiClient();
  let lastError: unknown = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await ai.models.generateContent(params);
    } catch (err: unknown) {
      lastError = err;
      const errMsg = err instanceof Error ? err.message : String(err);
      const isTransient =
        errMsg.includes("503") ||
        errMsg.includes("UNAVAILABLE") ||
        errMsg.includes("high demand") ||
        errMsg.includes("429") ||
        errMsg.includes("RESOURCE_EXHAUSTED");

      if (isTransient && attempt < maxRetries) {
        const delay = Math.min(
          800 * Math.pow(2, attempt - 1) + Math.random() * 400,
          4000
        );
        console.warn(
          `Gemini API geçici 503/yoğunluk yanıtı verdi (${attempt}/${maxRetries}), ${Math.round(delay)}ms sonra yeniden deneniyor...`
        );
        await new Promise((res) => setTimeout(res, delay));
        continue;
      }

      // If primary model continues to be overloaded after retries, try latest flash alias
      if (isTransient && params.model === "gemini-3.8-flash") {
        try {
          console.warn(
            "gemini-3.8-flash anlık yoğunlukta; 'gemini-flash-latest' ile son deneme yapılıyor..."
          );
          return await ai.models.generateContent({
            ...params,
            model: "gemini-flash-latest",
          });
        } catch (fallbackErr) {
          lastError = fallbackErr;
        }
      }

      throw err;
    }
  }

  throw lastError;
}

