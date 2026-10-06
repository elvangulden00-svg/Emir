// components/GazeteGorunumu.tsx
"use client";

import React, { useState } from "react";
import {
  Printer,
  Copy,
  Download,
  Check,
  HelpCircle,
  Quote,
  Stamp,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export interface GazeteVerisi {
  gazeteAdi: string;
  tarih: string;
  sayiNo: string;
  manset: string;
  spot: string;
  haberMetni: string;
  alintilar: Array<{
    metin: string;
    belge: string;
    kaynakKisi?: string;
  }>;
  kontrolSorulari: Array<{
    soru: string;
    ipucuVeyaCevap: string;
    dayanakBelge: string;
  }>;
}

interface GazeteGorunumuProps {
  gazete: GazeteVerisi;
  onYenidenUret: () => void;
  yukleniyor: boolean;
}

export function GazeteGorunumu({
  gazete,
  onYenidenUret,
  yukleniyor,
}: GazeteGorunumuProps) {
  const [kopyalandi, setKopyalandi] = useState(false);
  const [acikSorular, setAcikSorular] = useState<number[]>([]);

  const toggleSoru = (idx: number) => {
    setAcikSorular((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const yazdir = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const metniKopyala = () => {
    const tumMetin = `${gazete.gazeteAdi || "TARİH MUHABİRİ"} - ${gazete.tarih || "1919"}
MANŞET: ${gazete.manset}
SPOT: ${gazete.spot}

HABER METNİ:
${gazete.haberMetni}

VESİKALARDAN BİREBİR ALINTILAR:
${gazete.alintilar.map((a) => `• "${a.metin}" (${a.belge})`).join("\n")}

KONTROL SORULARI:
${gazete.kontrolSorulari.map((k, i) => `${i + 1}. ${k.soru} [${k.dayanakBelge}]\nCevap/İpucu: ${k.ipucuVeyaCevap}`).join("\n\n")}
`;
    navigator.clipboard.writeText(tumMetin);
    setKopyalandi(true);
    setTimeout(() => setKopyalandi(false), 2500);
  };

  const jsonIndir = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(gazete, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `tarih-gazetesi-1919.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar (Hidden in Print) */}
      <div className="no-print bg-stone-900 border border-stone-800 rounded-xl p-4 text-stone-200 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Stamp className="w-5 h-5 text-amber-500" />
          <span className="font-serif font-bold text-amber-100 text-sm">
            1919 Dönemi Tarihî Gazete Baskısı
          </span>
          <span className="text-xs bg-stone-800 text-stone-400 px-2 py-0.5 rounded border border-stone-700">
            Arşiv Nüshası
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={yazdir}
            className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Gazete sayfasını yazdır veya PDF olarak kaydet"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Yazdır / PDF Kaydet</span>
          </button>

          <button
            onClick={metniKopyala}
            className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {kopyalandi ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Kopyalandı!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Metni Kopyala</span>
              </>
            )}
          </button>

          <button
            onClick={jsonIndir}
            className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON İndir</span>
          </button>

          <button
            onClick={onYenidenUret}
            disabled={yukleniyor}
            className="px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-600 text-white text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            {yukleniyor ? "Basılıyor..." : "Yeniden Bas"}
          </button>
        </div>
      </div>

      {/* 1919 Authentic Newspaper Sheet Container */}
      <div className="newspaper-sheet bg-[#f6f2e9] text-[#1c1917] border-4 border-double border-[#2b241c] rounded-lg shadow-xl p-6 sm:p-10 font-serif max-w-5xl mx-auto selection:bg-[#e4d4b8]">
        {/* Newspaper Masthead / Banner */}
        <header className="border-b-4 border-[#2b241c] pb-4 mb-6">
          {/* Metadata Top Bar */}
          <div className="flex items-center justify-between text-xs sm:text-sm uppercase tracking-widest border-b border-[#2b241c]/60 pb-2 mb-3 text-[#44382c] font-sans font-semibold">
            <span>{gazete.sayiNo || "SAYI: 1919 - CİLT: 1"}</span>
            <span className="font-serif italic capitalize">
              Millî Mücâhede ve İrâde-i Vataniye Mecmuası
            </span>
            <span>{gazete.tarih || "1919 GÜNLERİ"}</span>
          </div>

          {/* Main Newspaper Name / Logo */}
          <div className="text-center py-2 relative">
            {/* Vintage Emblem/Stamp */}
            <div className="text-[11px] font-mono tracking-widest text-[#665440] uppercase mb-1">
              ❖ TARİH MUHABİRİ DÖNEM BASKISI ❖
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#1a140e] uppercase scale-y-105">
              {gazete.gazeteAdi || "HÂKİMİYET-İ MİLLİYE"}
            </h1>
            <p className="text-xs sm:text-sm italic text-[#554332] mt-1 font-serif">
              &quot;Hâkimiyet bilâ-kayd-u şart milletindir — Yalnızca birincil vesikalarla neşrolunur.&quot;
            </p>
          </div>

          {/* Masthead Bottom Bar */}
          <div className="flex items-center justify-between text-[11px] uppercase tracking-wider border-t border-[#2b241c]/60 pt-2 mt-3 text-[#44382c] font-sans font-medium">
            <span>FİYATI: 20 PARA</span>
            <span>İDAREHANE: SİVAS / ANKARA / AMASYA</span>
            <span>ÖZEL MUHABİR SERVİSİ</span>
          </div>
        </header>

        {/* Newspaper Headline (Manşet) */}
        <div className="text-center my-6 pb-4 border-b-2 border-[#2b241c]/40">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#110d08] uppercase tracking-tight leading-tight max-w-4xl mx-auto">
            {gazete.manset}
          </h2>
          {gazete.spot && (
            <p className="mt-3 text-base sm:text-lg italic font-semibold text-[#382b20] max-w-3xl mx-auto leading-snug">
              {gazete.spot}
            </p>
          )}
        </div>

        {/* Multi-Column News Article Body */}
        <div className="my-6">
          <div className="newspaper-columns text-justify text-sm sm:text-base leading-relaxed text-[#1a1714] space-y-4">
            {gazete.haberMetni.split("\n\n").map((paragraf, pIdx) => (
              <p
                key={pIdx}
                className={
                  pIdx === 0
                    ? "first-letter:float-left first-letter:text-5xl first-letter:pr-3 first-letter:font-black first-letter:font-serif first-letter:text-[#2b241c]"
                    : ""
                }
              >
                {paragraf}
              </p>
            ))}
          </div>
        </div>

        {/* Verbatim Quotes Box (Alıntılar Köşesi) */}
        {gazete.alintilar && gazete.alintilar.length > 0 && (
          <div className="my-8 border-2 border-[#2b241c] p-5 sm:p-6 bg-[#eee8db]/60 rounded-sm">
            <div className="flex items-center justify-between border-b border-[#2b241c]/60 pb-2 mb-4">
              <div className="flex items-center gap-2">
                <Quote className="w-5 h-5 text-[#6e5842]" />
                <h3 className="font-bold text-sm sm:text-base uppercase tracking-wider text-[#1a140e]">
                  Vesikalardan Birebir İktibaslar (Alıntılar Köşesi)
                </h3>
              </div>
              <span className="text-xs italic text-[#554332]">
                Harfi Harfine Kaynaktan
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gazete.alintilar.map((alinti, aIdx) => (
                <div
                  key={aIdx}
                  className="p-3.5 bg-[#f6f2e9] border border-[#2b241c]/30 rounded-xs flex flex-col justify-between"
                >
                  <blockquote className="text-xs sm:text-sm italic font-semibold text-[#1a1510] leading-relaxed">
                    &ldquo;{alinti.metin}&rdquo;
                  </blockquote>
                  <div className="mt-2.5 pt-2 border-t border-[#2b241c]/20 flex items-center justify-between text-xs font-sans">
                    <span className="font-bold text-[#44382c]">
                      {alinti.kaynakKisi || "Belge Metni"}
                    </span>
                    <span className="font-mono text-[11px] bg-[#dfd6c5] text-[#2b241c] px-2 py-0.5 rounded border border-[#c5b9a4]">
                      {alinti.belge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pedagogical Comprehension Questions (Kontrol Soruları) */}
        {gazete.kontrolSorulari && gazete.kontrolSorulari.length > 0 && (
          <div className="my-8 border-t-2 border-[#2b241c] pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#6e5842]" />
                <h3 className="font-bold text-base uppercase tracking-wider text-[#1a140e]">
                  Tarih Dersi Kontrol Soruları (Kaynak Analizi)
                </h3>
              </div>
              <span className="text-xs text-[#554332] font-sans">
                3 Adet Kritik Soru
              </span>
            </div>

            <div className="space-y-3 font-sans">
              {gazete.kontrolSorulari.map((ks, sIdx) => {
                const acik = acikSorular.includes(sIdx);
                return (
                  <div
                    key={sIdx}
                    className="border border-[#2b241c]/40 rounded-sm bg-[#faf7ef] overflow-hidden"
                  >
                    <div
                      onClick={() => toggleSoru(sIdx)}
                      className="p-3.5 flex items-start justify-between gap-3 cursor-pointer hover:bg-[#eee8db]/50 transition-colors"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-[#2b241c] text-[#f6f2e9] text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                          {sIdx + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-sm text-[#1a140e] leading-snug">
                            {ks.soru}
                          </p>
                          <span className="inline-block mt-1 text-[11px] font-mono text-[#6e5842]">
                            Dayanak: {ks.dayanakBelge}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="text-xs text-[#6e5842] flex items-center gap-1 shrink-0 pt-0.5 font-medium"
                      >
                        <span>{acik ? "Gizle" : "Cevabı Göster"}</span>
                        {acik ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {acik && (
                      <div className="p-3.5 bg-[#f0ebd9] border-t border-[#2b241c]/30 text-xs sm:text-sm text-[#2b241c] leading-relaxed">
                        <div className="font-bold text-[11px] uppercase tracking-wider text-[#6e5842] mb-1">
                          Öğretmen Cevap Rehberi &amp; Belge Kanıtı:
                        </div>
                        <p>{ks.ipucuVeyaCevap}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Newspaper Footer / Stamp */}
        <footer className="mt-8 pt-4 border-t-2 border-[#2b241c]/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#554332] font-sans">
          <div>
            Basım Yeri: Tarih Muhabiri Matbaası / Millî Arşiv Fonu 1919
          </div>
          <div className="italic font-serif">
            &ldquo;Tarih bilinci, vesikaların tarafsız tetkikiyle başlar.&rdquo;
          </div>
        </footer>
      </div>
    </div>
  );
}
