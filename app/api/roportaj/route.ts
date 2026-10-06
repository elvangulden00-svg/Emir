// app/api/roportaj/route.ts
import { NextRequest, NextResponse } from "next/server";
import { generateContentWithRetry, formatGeminiError } from "@/lib/gemini";
import { GEMINI_MODEL, SISTEM_TALIMATI } from "@/lib/talimat";

interface Mesaj {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { belgeler, soru, gecmis = [] } = body;

    if (!belgeler || typeof belgeler !== "string" || !belgeler.trim()) {
      return NextResponse.json(
        { error: "Lütfen önce en az bir tarihî belge metni ekleyin." },
        { status: 400 }
      );
    }

    if (!soru || typeof soru !== "string" || !soru.trim()) {
      return NextResponse.json(
        { error: "Lütfen öğrencinin sorusunu yazın." },
        { status: 400 }
      );
    }

    // Prepare contents array for Gemini
    const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];

    // First user turn provides the primary documents
    let initialPrompt = `Aşağıda öğretmenin sisteme yüklediği tarihî belgeler yer almaktadır. Röportaj boyunca vereceğin tüm cevaplarda yalnızca bu belgelerdeki bilgileri kullanacaksın:\n\n=== YÜKLENEN TARİHÎ BELGELER ===\n${belgeler.trim()}\n==============================\n\nBu belgeleri dikkatlice incele ve kurallara harfiyen uyarak bir tarih muhabiri olarak görevine başla.`;

    contents.push({
      role: "user",
      parts: [{ text: initialPrompt }],
    });

    contents.push({
      role: "model",
      parts: [
        {
          text: "Belgeleri dikkatle inceledim. Bir tarih muhabiri olarak hazırım; yalnızca bu belgelerdeki bilgileri aktaracak, üçüncü şahıs dili kullanacak, tarihî kişileri canlandırmayacak, birebir alıntıları tırnak içinde belirtecek, her cevabımın sonuna [Belge X] atfını ekleyeceğim ve belgede bulunmayan sorular için kuraldaki uyarıyı vereceğim. Öğrencilerin sorularını bekliyorum.",
        },
      ],
    });

    // Add prior dialogue if any
    for (const msg of (gecmis as Mesaj[]).slice(-6)) {
      if (msg.role === "user") {
        contents.push({
          role: "user",
          parts: [{ text: msg.content }],
        });
      } else if (msg.role === "assistant") {
        contents.push({
          role: "model",
          parts: [{ text: msg.content }],
        });
      }
    }

    // Add the current question
    contents.push({
      role: "user",
      parts: [
        {
          text: `ÖĞRENCİ SORUSU: ${soru.trim()}\n\n(Hatırlatma: Yalnızca yukarıdaki belgelerden cevapla, 3. şahıs dili kullan, en fazla 5 cümle kur, alıntı varsa birebir aktar, belgede yoksa standart yok metnini yaz ve cevabın sonuna [Belge X] atfını ekle.)`,
        },
      ],
    });

    const response = await generateContentWithRetry({
      model: GEMINI_MODEL,
      contents,
      config: {
        systemInstruction: SISTEM_TALIMATI,
        temperature: 0.2,
      },
    });

    const cevap = response.text || "Muhabir şu anda cevap oluşturamadı.";

    return NextResponse.json({ cevap });
  } catch (err: unknown) {
    console.error("Röportaj API hatası:", err);
    const friendlyMessage = formatGeminiError(err);
    return NextResponse.json(
      { error: `Muhabir cevabı oluşturulurken bir sorun çıktı: ${friendlyMessage}` },
      { status: 500 }
    );
  }
}
