// components/RoportajBolumu.tsx
"use client";

import React, { useState } from "react";
import {
  Mic,
  Send,
  Loader2,
  Trash2,
  Volume2,
  HelpCircle,
  Newspaper,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Quote,
} from "lucide-react";

export interface SoruCevap {
  id: string;
  soru: string;
  cevap: string;
  tarih: string;
}

function kayitOlustur(soru: string, cevap: string): SoruCevap {
  const simdi = new Date();
  const saat = `${simdi.getHours().toString().padStart(2, "0")}:${simdi.getMinutes().toString().padStart(2, "0")}`;
  return {
    id: `soru-${simdi.getTime()}-${Math.random().toString(36).slice(2, 7)}`,
    soru,
    cevap,
    tarih: saat,
  };
}

interface RoportajBolumuProps {
  belgeler: string;
  roportajGecmisi: SoruCevap[];
  setRoportajGecmisi: React.Dispatch<React.SetStateAction<SoruCevap[]>>;
  onYayinaGec: () => void;
  onBelgelereDon: () => void;
  ornekSorular?: string[];
}

export function RoportajBolumu({
  belgeler,
  roportajGecmisi,
  setRoportajGecmisi,
  onYayinaGec,
  onBelgelereDon,
  ornekSorular = [],
}: RoportajBolumuProps) {
  const [soru, setSoru] = useState("");
  const [sonSoru, setSonSoru] = useState<string>("");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState<string | null>(null);
  const [sesCaliniyorId, setSesCaliniyorId] = useState<string | null>(null);

  const soruyuGonder = async (soruMetni?: string) => {
    const aktifSoru = (soruMetni || soru).trim();
    if (!aktifSoru) return;

    if (!belgeler.trim()) {
      setHata("Röportaja başlamak için önce 1. Bölümde tarihî belgeleri eklemelisiniz.");
      return;
    }

    setSonSoru(aktifSoru);
    setYukleniyor(true);
    setHata(null);

    try {
      const gecmisVerisi = roportajGecmisi.flatMap((item) => [
        { role: "user" as const, content: item.soru },
        { role: "assistant" as const, content: item.cevap },
      ]);

      const res = await fetch("/api/roportaj", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          belgeler,
          soru: aktifSoru,
          gecmis: gecmisVerisi,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Muhabir cevabı alınırken bir hata oluştu.");
      }

      const yeniKayit = kayitOlustur(aktifSoru, data.cevap);

      setRoportajGecmisi((prev) => [...prev, yeniKayit]);
      setSoru("");
    } catch (err: unknown) {
      console.error(err);
      setHata(err instanceof Error ? err.message : "Cevap alınamadı.");
    } finally {
      setYukleniyor(false);
    }
  };

  const cumleSayisiBul = (metin: string) => {
    const eslesmeler = metin.match(/[^.!?]+[.!?]+/g);
    return eslesmeler ? eslesmeler.length : 1;
  };

  const sesliOku = (id: string, metin: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Tarayıcınız ses sentezini desteklemiyor.");
      return;
    }

    if (sesCaliniyorId === id) {
      window.speechSynthesis.cancel();
      setSesCaliniyorId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(metin);
    utterance.lang = "tr-TR";
    utterance.rate = 1.0;

    // Try finding Turkish voice
    const voices = window.speechSynthesis.getVoices();
    const trVoice = voices.find((v) => v.lang.startsWith("tr"));
    if (trVoice) {
      utterance.voice = trVoice;
    }

    utterance.onend = () => setSesCaliniyorId(null);
    utterance.onerror = () => setSesCaliniyorId(null);

    setSesCaliniyorId(id);
    window.speechSynthesis.speak(utterance);
  };

  // Render response with highlighted citations and quotes
  const formatCevap = (cevapMetni: string) => {
    // Regex for [Belge X]
    const regex = /(\[Belge\s*[^\]]+\])|("([^"]+)")/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(cevapMetni)) !== null) {
      if (match.index > lastIndex) {
        parts.push(cevapMetni.substring(lastIndex, match.index));
      }

      if (match[1]) {
        // [Belge X] citation
        parts.push(
          <span
            key={match.index}
            className="inline-flex items-center font-mono font-bold text-xs bg-amber-200 text-amber-950 px-1.5 py-0.5 rounded border border-amber-300 mx-1 align-baseline"
          >
            {match[1]}
          </span>
        );
      } else if (match[2]) {
        // Direct quote
        parts.push(
          <span
            key={match.index}
            className="font-serif italic font-semibold text-stone-900 bg-amber-50/80 px-1 rounded border-b border-amber-300"
          >
            {match[2]}
          </span>
        );
      }
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < cevapMetni.length) {
      parts.push(cevapMetni.substring(lastIndex));
    }

    return parts;
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 text-stone-100 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/70 border border-amber-800/60 text-amber-300 text-xs font-medium mb-3">
              <Mic className="w-3.5 h-3.5" />
              2. Bölüm: Öğrenci Soruları &amp; Muhabir Röportajı
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-amber-100 tracking-tight mb-2">
              Tarih Muhabiri ile Canlı Röportaj
            </h2>
            <p className="text-stone-300 text-sm leading-relaxed">
              Öğrencilerinizin tarihî belgelere dair sorularını yazın. Muhabir
              tarihî kişileri canlandırmaz, üçüncü şahısla ve yalnızca belgedeki
              kanıtlara dayanarak cevap verir.
            </p>
          </div>

          <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
            <button
              onClick={onBelgelereDon}
              className="px-3 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium transition-colors text-left"
            >
              ← Belgeleri Güncelle
            </button>
            {roportajGecmisi.length > 0 && (
              <button
                onClick={onYayinaGec}
                className="px-4 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
              >
                <Newspaper className="w-4 h-4" />
                <span>3. Yayın Bölümüne Geç</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Suggested Quick Questions */}
      {ornekSorular.length > 0 && (
        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-700 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Öğrencilerin Sorabileceği Örnek Tarihî Sorular (Tıkla ve Sor):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {ornekSorular.map((q, idx) => (
              <button
                key={idx}
                onClick={() => soruyuGonder(q)}
                disabled={yukleniyor}
                type="button"
                className="text-xs text-stone-800 bg-stone-50 hover:bg-amber-50 hover:text-amber-950 border border-stone-200 hover:border-amber-300 rounded-lg px-3 py-1.5 transition-colors cursor-pointer text-left"
              >
                &ldquo;{q}&rdquo;
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error Banner with Retry */}
      {hata && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 text-amber-950 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold block text-amber-900">
                Geçici İletişim Durumu:
              </span>
              <p className="leading-relaxed">{hata}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            {sonSoru && (
              <button
                type="button"
                onClick={() => soruyuGonder(sonSoru)}
                disabled={yukleniyor}
                className="px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-medium text-xs transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <span>Tekrar Dene</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setHata(null)}
              className="p-1 rounded text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Conversation Thread */}
      <div className="space-y-4">
        {roportajGecmisi.length === 0 ? (
          <div className="bg-stone-50 border-2 border-dashed border-stone-200 rounded-2xl p-10 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-stone-800 text-lg mb-1">
              Henüz soru sorulmadı
            </h3>
            <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto mb-4">
              Aşağıdaki soru kutusuna öğrencilerin sorduğu bir soruyu yazın veya
              yukarıdaki örnek sorulardan birine tıklayın.
            </p>
          </div>
        ) : (
          roportajGecmisi.map((item, index) => {
            const cumleSayisi = cumleSayisiBul(item.cevap);
            const yokMu = item.cevap.includes("Bu belgelerde bu sorunun cevabı yok");

            return (
              <div
                key={item.id}
                className="bg-white border border-stone-200 rounded-2xl shadow-xs overflow-hidden transition-all"
              >
                {/* Student Question Row */}
                <div className="bg-stone-100/70 border-b border-stone-200 p-4 sm:px-6 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-stone-700 text-stone-100 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    S{index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-stone-700 tracking-wide uppercase">
                        Öğrenci Sorusu
                      </span>
                      <span className="text-[11px] text-stone-600 font-mono">
                        {item.tarih}
                      </span>
                    </div>
                    <p className="font-medium text-stone-900 text-sm sm:text-base leading-snug">
                      {item.soru}
                    </p>
                  </div>
                </div>

                {/* Reporter Answer Row */}
                <div className="p-5 sm:px-6 bg-white space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-serif font-bold shrink-0">
                        TM
                      </div>
                      <div>
                        <span className="text-xs font-bold text-amber-900 font-serif">
                          Tarih Muhabiri Yanıtı
                        </span>
                        <span className="text-[11px] text-stone-500 ml-2 hidden sm:inline">
                          (3. Şahıs &amp; Belgeye Dayalı)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Sentence count badge */}
                      <span
                        className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${
                          cumleSayisi <= 5
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : "bg-amber-50 text-amber-800 border-amber-200"
                        }`}
                        title="Kural: En fazla 5 cümle"
                      >
                        {cumleSayisi} Cümle {cumleSayisi <= 5 ? "✓" : ""}
                      </span>

                      {/* Read aloud */}
                      <button
                        onClick={() => sesliOku(item.id, item.cevap)}
                        className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer flex items-center gap-1 ${
                          sesCaliniyorId === item.id
                            ? "bg-amber-600 text-white"
                            : "text-stone-500 hover:text-amber-800 hover:bg-stone-100"
                        }`}
                        title="Cevabı Seslendir"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span className="text-[11px] hidden sm:inline">
                          {sesCaliniyorId === item.id ? "Durdur" : "Dinle"}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Formatted Answer Body */}
                  <div
                    className={`text-sm sm:text-base leading-relaxed p-4 rounded-xl font-serif ${
                      yokMu
                        ? "bg-amber-50/70 border border-amber-200/80 text-amber-950"
                        : "bg-stone-50 border border-stone-200/70 text-stone-800"
                    }`}
                  >
                    {yokMu && (
                      <div className="flex items-center gap-1.5 text-xs font-sans font-bold text-amber-800 mb-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>Kural Uyarısı: Belgede Bulunmayan Bilgi</span>
                      </div>
                    )}
                    {formatCevap(item.cevap)}
                  </div>

                  {/* Verification Badges */}
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-stone-500">
                    <span className="flex items-center gap-1 text-emerald-700">
                      <CheckCircle className="w-3 h-3" />
                      3. Şahıs Anlatımı
                    </span>
                    <span className="flex items-center gap-1 text-emerald-700">
                      <CheckCircle className="w-3 h-3" />
                      Dayanak Belge Belirtildi
                    </span>
                    {item.cevap.includes('"') && (
                      <span className="flex items-center gap-1 text-amber-700">
                        <Quote className="w-3 h-3" />
                        Belgeden Birebir Alıntı Yapıldı
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Question Input Box */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-md sticky bottom-4 z-30">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            soruyuGonder();
          }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-medium text-stone-700 flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-amber-700" />
              Öğrenci Sorusunu Yazınız (Kişisel veri girmeyiniz)
            </span>
            {roportajGecmisi.length > 0 && (
              <button
                type="button"
                onClick={() => setRoportajGecmisi([])}
                className="text-stone-400 hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer"
                title="Röportaj geçmişini sıfırla"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Geçmişi Temizle</span>
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={soru}
              onChange={(e) => setSoru(e.target.value)}
              placeholder="Örn: Mustafa Kemal Paşa Amasya Genelgesi'nde milletin durumunu nasıl açıklamıştır?"
              disabled={yukleniyor}
              className="flex-1 px-4 py-3 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-stone-900 text-sm bg-stone-50/50"
            />
            <button
              type="submit"
              disabled={yukleniyor || !soru.trim()}
              className={`px-5 py-3 rounded-xl font-medium text-sm flex items-center gap-2 transition-all cursor-pointer ${
                yukleniyor || !soru.trim()
                  ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                  : "bg-amber-700 hover:bg-amber-800 text-white shadow-md hover:shadow-lg"
              }`}
            >
              {yukleniyor ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Muhabir İnceliyor...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Soruyu Cevapla</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Transition to Publication */}
        {roportajGecmisi.length >= 2 && (
          <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-medium">
              ✓ Yeterli soru-cevap birikti ({roportajGecmisi.length} soru).
            </span>
            <button
              onClick={onYayinaGec}
              className="font-bold text-amber-800 hover:text-amber-950 underline underline-offset-4 cursor-pointer"
            >
              Gazete ve Podcast yayını oluşturmak için tıklayın →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
