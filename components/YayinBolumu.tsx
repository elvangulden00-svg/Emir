// components/YayinBolumu.tsx
"use client";

import React, { useState } from "react";
import { Newspaper, Radio, Loader2, Sparkles, AlertCircle, ArrowLeft } from "lucide-react";
import { GazeteGorunumu, GazeteVerisi } from "./GazeteGorunumu";
import { PodcastStudyosu, PodcastVerisi } from "./PodcastStudyosu";
import { SoruCevap } from "./RoportajBolumu";

interface YayinBolumuProps {
  belgeler: string;
  roportajGecmisi: SoruCevap[];
  gazete: GazeteVerisi | null;
  setGazete: React.Dispatch<React.SetStateAction<GazeteVerisi | null>>;
  podcast: PodcastVerisi | null;
  setPodcast: React.Dispatch<React.SetStateAction<PodcastVerisi | null>>;
  onRoportajaDon: () => void;
}

export function YayinBolumu({
  belgeler,
  roportajGecmisi,
  gazete,
  setGazete,
  podcast,
  setPodcast,
  onRoportajaDon,
}: YayinBolumuProps) {
  const [altSekme, setAltSekme] = useState<"gazete" | "podcast">("gazete");
  const [gazeteYukleniyor, setGazeteYukleniyor] = useState(false);
  const [podcastYukleniyor, setPodcastYukleniyor] = useState(false);
  const [hata, setHata] = useState<string | null>(null);

  const gazeteOlustur = async () => {
    if (!belgeler.trim()) {
      setHata("Gazete sayfası oluşturmak için önce 1. Bölümde tarihî belgeleri ekleyin.");
      return;
    }

    setGazeteYukleniyor(true);
    setHata(null);

    try {
      const res = await fetch("/api/gazete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          belgeler,
          roportajGecmisi,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gazete sayfası üretilemedi.");
      }

      setGazete(data.gazete);
      setAltSekme("gazete");
    } catch (err: unknown) {
      console.error(err);
      setHata(err instanceof Error ? err.message : "Gazete oluşturulamadı.");
    } finally {
      setGazeteYukleniyor(false);
    }
  };

  const podcastOlustur = async () => {
    if (!belgeler.trim()) {
      setHata("Podcast hazırlamak için önce tarihî belgeleri eklemelisiniz.");
      return;
    }

    setPodcastYukleniyor(true);
    setHata(null);

    try {
      const res = await fetch("/api/podcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          belgeler,
          gazete,
          roportajGecmisi,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Podcast kaydı üretilemedi.");
      }

      setPodcast(data);
      setAltSekme("podcast");
    } catch (err: unknown) {
      console.error(err);
      setHata(err instanceof Error ? err.message : "Podcast oluşturulamadı.");
    } finally {
      setPodcastYukleniyor(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Two Action Buttons ("Gazete Sayfası Yap" and "Podcast Yap") */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 text-stone-100 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/70 border border-amber-800/60 text-amber-300 text-xs font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              3. Bölüm: Basın ve Yayın Stüdyosu
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-amber-100 tracking-tight mb-2">
              Tarih Muhabiri Yayın Merkezi
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              Belgelerden ve öğrenci röportajından elde edilen verileri, 1919
              döneminin otantik gazete sayfasına veya Muhabir-Tarihçi arasındaki 1
              dakikalık sesli podcaste dönüştürün.
            </p>
          </div>

          <button
            onClick={onRoportajaDon}
            className="self-start md:self-center px-3 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Röportaja Dön</span>
          </button>
        </div>

        {/* TWO PRIMARY ACTION BUTTONS (Zorunlu İki Düğme: "Gazete Sayfası Yap" & "Podcast Yap") */}
        <div className="mt-6 pt-6 border-t border-stone-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Button 1: Gazete Sayfası Yap */}
          <button
            onClick={gazeteOlustur}
            disabled={gazeteYukleniyor}
            type="button"
            className="p-4 sm:p-5 rounded-xl border border-amber-700/60 bg-gradient-to-r from-amber-900/60 to-stone-900 hover:from-amber-800/70 hover:to-stone-850 text-left transition-all group shadow-md hover:shadow-xl cursor-pointer disabled:opacity-50"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="w-10 h-10 rounded-lg bg-amber-600 text-white flex items-center justify-center shadow-xs">
                {gazeteYukleniyor ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Newspaper className="w-5 h-5" />
                )}
              </span>
              <span className="text-[11px] font-mono uppercase bg-amber-950 px-2 py-0.5 rounded text-amber-300 border border-amber-800/80">
                1919 Baskısı
              </span>
            </div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-amber-100 group-hover:text-amber-50">
              Gazete Sayfası Yap
            </h3>
            <p className="text-xs text-stone-400 mt-1 leading-snug">
              Manşet, spot, haber metni, birebir belge alıntıları ve 3 kontrol sorusuyla dönemin gazetesini bas.
            </p>
          </button>

          {/* Button 2: Podcast Yap */}
          <button
            onClick={podcastOlustur}
            disabled={podcastYukleniyor}
            type="button"
            className="p-4 sm:p-5 rounded-xl border border-stone-700 bg-gradient-to-r from-stone-900 to-amber-950/40 hover:from-stone-850 hover:to-amber-900/50 text-left transition-all group shadow-md hover:shadow-xl cursor-pointer disabled:opacity-50"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="w-10 h-10 rounded-lg bg-stone-700 group-hover:bg-amber-600 text-white flex items-center justify-center shadow-xs transition-colors">
                {podcastYukleniyor ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Radio className="w-5 h-5" />
                )}
              </span>
              <span className="text-[11px] font-mono uppercase bg-stone-800 px-2 py-0.5 rounded text-amber-300 border border-stone-700">
                1 Dakika • 2 Ses
              </span>
            </div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-100 group-hover:text-amber-50">
              Podcast Yap
            </h3>
            <p className="text-xs text-stone-400 mt-1 leading-snug">
              Muhabir ve Tarihçi arasında 1 dakikalık sesli diyalog oluştur ve iki farklı Türkçe sesle seslendir.
            </p>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {hata && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 text-amber-950 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold block text-amber-900">
                Yayın Hazırlama Bildirimi:
              </span>
              <p className="leading-relaxed">{hata}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              onClick={() => {
                if (altSekme === "gazete") gazeteOlustur();
                else podcastOlustur();
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-medium text-xs transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Tekrar Dene</span>
            </button>
            <button
              onClick={() => setHata(null)}
              className="p-1 rounded text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Secondary Toggle Tabs if both are available or one is selected */}
      {(gazete || podcast) && (
        <div className="no-print flex items-center justify-center">
          <div className="bg-stone-200 p-1 rounded-xl inline-flex space-x-1">
            <button
              onClick={() => setAltSekme("gazete")}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
                altSekme === "gazete"
                  ? "bg-white text-stone-900 shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Newspaper className="w-4 h-4 text-amber-700" />
              <span>Gazete Görünümü</span>
              {gazete && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
            </button>

            <button
              onClick={() => setAltSekme("podcast")}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
                altSekme === "podcast"
                  ? "bg-white text-stone-900 shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Radio className="w-4 h-4 text-amber-700" />
              <span>Podcast Stüdyosu</span>
              {podcast && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
            </button>
          </div>
        </div>
      )}

      {/* Content Display */}
      {gazeteYukleniyor || podcastYukleniyor ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-16 text-center shadow-xs">
          <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-4 animate-bounce">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="font-serif font-bold text-stone-900 text-xl mb-1">
            {gazeteYukleniyor
              ? "1919 Dönemi Gazete Sayfası Diziliyor..."
              : "Podcast Stüdyosunda Ses Kaydı Alınıyor..."}
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
            {gazeteYukleniyor
              ? "Belgelerdeki kanıtlar inceleniyor, manşet ve alıntılar harfi harfine yerleştiriliyor."
              : "Muhabir ve Tarihçi diyalogları oluşturuluyor, iki farklı ses tonuyla Türkçe seslendiriliyor."}
          </p>
        </div>
      ) : altSekme === "gazete" && gazete ? (
        <GazeteGorunumu
          gazete={gazete}
          onYenidenUret={gazeteOlustur}
          yukleniyor={gazeteYukleniyor}
        />
      ) : altSekme === "podcast" && podcast ? (
        <PodcastStudyosu
          podcast={podcast}
          onYenidenKaydet={podcastOlustur}
          yukleniyor={podcastYukleniyor}
        />
      ) : !gazete && !podcast ? (
        <div className="bg-stone-50 border-2 border-dashed border-stone-200 rounded-2xl p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center mx-auto mb-3">
            <Newspaper className="w-7 h-7" />
          </div>
          <h3 className="font-serif font-bold text-stone-800 text-lg mb-1">
            Yayın Oluşturulmaya Hazır
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto mb-6">
            Yukarıdaki &quot;Gazete Sayfası Yap&quot; veya &quot;Podcast Yap&quot; düğmelerine
            tıklayarak tarihî içeriğinizi dönemin formatında yayınlayın.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={gazeteOlustur}
              className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              Gazete Sayfasını Başlat
            </button>
            <button
              onClick={podcastOlustur}
              className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-900 text-stone-100 text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              Podcast Kaydını Başlat
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
