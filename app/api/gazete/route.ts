// app/api/gazete/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Type } from "@google/genai";
import { generateContentWithRetry, formatGeminiError } from "@/lib/gemini";
import { GEMINI_MODEL, SISTEM_TALIMATI } from "@/lib/talimat";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { belgeler, roportajGecmisi = [] } = body;

    if (!belgeler || typeof belgeler !== "string" || !belgeler.trim()) {
      return NextResponse.json(
        { error: "Gazete sayfası oluşturmak için en az bir tarihî belge gereklidir." },
        { status: 400 }
      );
    }

    let roportajMetni = "";
    if (Array.isArray(roportajGecmisi) && roportajGecmisi.length > 0) {
      roportajMetni = roportajGecmisi
        .map(
          (r: { soru?: string; cevap?: string }, idx: number) =>
            `Soru ${idx + 1}: ${r.soru || ""}\nCevap ${idx + 1}: ${r.cevap || ""}`
        )
        .join("\n\n");
    }

    const prompt = `Aşağıdaki tarihî belgelere ve yapılan röportaj notlarına dayanarak 1919 dönemi gazete sayfası içeriğini JSON formatında oluştur.

=== YÜKLENEN TARİHÎ BELGELER ===
${belgeler.trim()}
==============================

=== YAPILAN RÖPORTAJ VE SORU-CEVAP NOTLARI ===
${roportajMetni || "(Henüz röportaj sorusu sorulmadı, doğrudan belgelere dayanarak gazeteyi hazırla)"}
=============================================

GAZETE SAYFASI KURALLARI:
1. "manset": Dönemin ruhuna uygun (1919 Millî Mücadele / Kongreler / Genelgeler dönemi), çarpıcı, büyük gazete manşeti.
2. "spot": Manşetin altındaki 1-2 cümlelik vurucu alt başlık / spot özet.
3. "haberMetni": 3. tekil şahıs diliyle, tamamen ve YALNIZCA belgelere sadık kalarak yazılmış, dönemin kamuoyuna hitap eden 2-3 paragraflık gazete haber metni. Tarihî kişileri canlandırma, yaptıklarını ve bildirdiklerini üçüncü şahıs olarak haberleştir.
4. "alintilar": Belgelerdeki ifadelerden seçilmiş BİREBİR alıntılar. Her alıntının "metin" alanı belgeden harfi harfine ("...") alınmalı, asla uydurulmamalı; "belge" alanında hangi belgeden olduğu ([Belge 1], [Belge 2] vb.) ve varsa "kaynakKisi" belirtilmelidir. En az 2, en fazla 4 alıntı yer almalı.
5. "kontrolSorulari": Öğrencilerin ve okurların metni anlama ve eleştirel kaynak okuma becerisini ölçecek TAM 3 ADET soru. Her sorunun "soru", "ipucuVeyaCevap" ve "dayanakBelge" ([Belge 1] vb.) alanı olmalı.
6. "gazeteAdi": Döneme uygun gazete başlığı (Örn: "İrade-i Milliye", "Hakimiyet-i Milliye", "İkdam" veya "Tarih Muhabiri").
7. "tarih": Belgelerin geçtiği döneme uygun tarih (Örn: "23 Haziran 1919", "4 Eylül 1919").
8. "sayiNo": Döneme uygun sayı numarası (Örn: "Sayı: 12 - Fiyatı: 20 Para").
`;

    const response = await generateContentWithRetry({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction: SISTEM_TALIMATI,
        temperature: 0.25,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            gazeteAdi: { type: Type.STRING },
            tarih: { type: Type.STRING },
            sayiNo: { type: Type.STRING },
            manset: { type: Type.STRING },
            spot: { type: Type.STRING },
            haberMetni: { type: Type.STRING },
            alintilar: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  metin: { type: Type.STRING },
                  belge: { type: Type.STRING },
                  kaynakKisi: { type: Type.STRING },
                },
                required: ["metin", "belge"],
              },
            },
            kontrolSorulari: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  soru: { type: Type.STRING },
                  ipucuVeyaCevap: { type: Type.STRING },
                  dayanakBelge: { type: Type.STRING },
                },
                required: ["soru", "ipucuVeyaCevap", "dayanakBelge"],
              },
            },
          },
          required: ["manset", "spot", "haberMetni", "alintilar", "kontrolSorulari"],
        },
      },
    });

    const rawText = response.text || "{}";
    const gazeteData = JSON.parse(rawText);

    return NextResponse.json({ success: true, gazete: gazeteData });
  } catch (err: unknown) {
    console.error("Gazete API hatası:", err);
    const friendlyMessage = formatGeminiError(err);
    return NextResponse.json(
      { error: `Gazete sayfası oluşturulurken hata oluştu: ${friendlyMessage}` },
      { status: 500 }
    );
  }
}
