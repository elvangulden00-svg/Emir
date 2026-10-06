// app/api/podcast/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Type } from "@google/genai";
import { getGeminiClient, generateContentWithRetry, formatGeminiError } from "@/lib/gemini";
import { GEMINI_MODEL, GEMINI_TTS_MODEL, SISTEM_TALIMATI } from "@/lib/talimat";

export interface DialogueLine {
  speaker: "Muhabir" | "Tarihçi";
  text: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { belgeler, gazete, roportajGecmisi = [] } = body;

    if (!belgeler || typeof belgeler !== "string" || !belgeler.trim()) {
      return NextResponse.json(
        { error: "Podcast kaydı için önce tarihî belge metinleri gereklidir." },
        { status: 400 }
      );
    }

    const ai = getGeminiClient();

    // Context from newspaper if available
    let gazeteOzeti = "";
    if (gazete && typeof gazete === "object") {
      gazeteOzeti = `
Manşet: ${gazete.manset || ""}
Spot: ${gazete.spot || ""}
Haber Metni: ${gazete.haberMetni || ""}
Alıntılar: ${(gazete.alintilar || []).map((a: { metin: string; belge: string }) => `"${a.metin}" (${a.belge})`).join(", ")}
`;
    }

    // Step 1: Script generation using GEMINI_MODEL (gemini-3.8-flash) with retry
    const scriptPrompt = `Aşağıdaki tarihî belgelere ve haber metnine dayanarak, "Muhabir" ile "Tarihçi" arasında geçen tam 1 dakikalık (yaklaşık 120-150 kelimelik, 6-8 karşılıklı replik) bir podcast diyalog metni oluştur.

=== TARİHÎ BELGELER ===
${belgeler.trim()}

=== GAZETE BİLGİSİ ===
${gazeteOzeti || "Doğrudan belgelere dayalı konuşma yapın."}

KURALLAR:
1. Konuşmacılar YALNIZCA "Muhabir" ve "Tarihçi" olacaktır.
2. Muhabir programı açar, kritik soruları sorar ve belgeye dikkat çeker.
3. Tarihçi de TARİHÎ KİŞİLERİ ASLA CANLANDIRMAZ; onları ve kararlarını üçüncü şahıs diliyle nesnel olarak belgeler ışığında anlatır.
4. Yalnızca yüklenen belgelerdeki bilgiler ve birebir alıntılar konuşulur, dış bilgi veya kurgu eklenmez.
5. Replikler doğal, Türkçe diksiyona uygun, 1 dakikalık radyo akışına elverişli olsun.
6. JSON formatında 'title' ve 'dialogue' (speaker ve text içeren dizi) olarak döndür.
`;

    const scriptResponse = await generateContentWithRetry({
      model: GEMINI_MODEL,
      contents: scriptPrompt,
      config: {
        systemInstruction: SISTEM_TALIMATI,
        temperature: 0.3,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            dialogue: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  speaker: {
                    type: Type.STRING,
                    description: "Sadece 'Muhabir' veya 'Tarihçi'",
                  },
                  text: { type: Type.STRING },
                },
                required: ["speaker", "text"],
              },
            },
          },
          required: ["title", "dialogue"],
        },
      },
    });

    const scriptData = JSON.parse(scriptResponse.text || "{}");
    const dialogue: DialogueLine[] = scriptData.dialogue || [];
    const podcastTitle = scriptData.title || "Tarih Muhabiri Podcast Özel Yayını";

    // Step 2: Audio generation with Gemini TTS
    let audioBase64: string | null = null;
    let mimeType = "audio/wav";
    let ttsErrorDetail: string | null = null;

    try {
      // Build speech parts for dual speaker
      const speechParts = dialogue.map((line) => {
        const isReporter = line.speaker === "Muhabir";
        return {
          text: `${line.speaker}: ${line.text}`,
          speechMetadata: {
            speaker: line.speaker === "Muhabir" ? "Muhabir" : "Tarihçi",
            style: isReporter
              ? "Clear, lively, professional Turkish news podcast anchor"
              : "Calm, erudite, articulate Turkish historian",
          },
        };
      });

      // Try multi-speaker TTS using gemini-3.8-flash-tts
      const ttsResponse = await ai.models.generateContent({
        model: GEMINI_TTS_MODEL,
        contents: [
          {
            role: "user",
            parts: speechParts,
          },
        ],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            multiSpeakerVoiceConfig: {
              speakerVoiceConfigs: [
                {
                  speaker: "Muhabir",
                  voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: "Puck" },
                  },
                },
                {
                  speaker: "Tarihçi",
                  voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: "Kore" },
                  },
                },
              ],
            },
          },
        },
      });

      const extractedAudio =
        ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (extractedAudio) {
        audioBase64 = extractedAudio;
      }
    } catch (ttsErr: unknown) {
      console.warn("Multi-speaker Gemini TTS çağrısında hata:", ttsErr);
      ttsErrorDetail = ttsErr instanceof Error ? ttsErr.message : "TTS üretilemedi";

      // Fallback: Try single speaker with gemini-3.8-flash-lite-tts for full script reading
      try {
        const fullNarration = dialogue
          .map((d) => `${d.speaker}: ${d.text}`)
          .join("\n\n");

        const liteResponse = await ai.models.generateContent({
          model: "gemini-3.8-flash-lite-tts",
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: fullNarration,
                  speechMetadata: {
                    style: "Clear, engaging Turkish audio narration",
                  },
                },
              ],
            },
          ],
          config: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: "Zephyr" },
              },
            },
          },
        });

        const fallbackAudio =
          liteResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (fallbackAudio) {
          audioBase64 = fallbackAudio;
          ttsErrorDetail = null;
        }
      } catch (liteErr) {
        console.warn("Fallback TTS çağrısı da başarısız oldu:", liteErr);
      }
    }

    return NextResponse.json({
      success: true,
      title: podcastTitle,
      summary: scriptData.summary || "",
      dialogue,
      audioBase64,
      mimeType,
      ttsErrorDetail,
    });
  } catch (err: unknown) {
    console.error("Podcast API genel hatası:", err);
    const friendlyMessage = formatGeminiError(err);
    return NextResponse.json(
      { error: `Podcast hazırlanırken bir hata oluştu: ${friendlyMessage}` },
      { status: 500 }
    );
  }
}
