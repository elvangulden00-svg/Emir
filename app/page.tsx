// app/page.tsx
"use client";

import React, { useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { BelgelerBolumu } from "@/components/BelgelerBolumu";
import { RoportajBolumu, SoruCevap } from "@/components/RoportajBolumu";
import { YayinBolumu } from "@/components/YayinBolumu";
import { GazeteVerisi } from "@/components/GazeteGorunumu";
import { PodcastVerisi } from "@/components/PodcastStudyosu";
import { YardimModal } from "@/components/YardimModal";
import { ORNEK_BELGE_SETLERI, belgeSetiniMetneCevir } from "@/lib/ornekBelgeler";
import { motion, AnimatePresence } from "motion/react";
import { Feather, ArrowRight, ShieldCheck } from "lucide-react";

export default function HomePage() {
  // Navigation State
  const [aktifSekme, setAktifSekme] = useState<"belgeler" | "roportaj" | "yayin">("belgeler");
  const [yardimAcik, setYardimAcik] = useState(false);

  // Application Data States
  // Initialize with Amasya Genelgesi 1919 so teacher can immediately test
  const [belgeler, setBelgeler] = useState<string>(() =>
    belgeSetiniMetneCevir(ORNEK_BELGE_SETLERI[0])
  );
  const [roportajGecmisi, setRoportajGecmisi] = useState<SoruCevap[]>([]);
  const [gazete, setGazete] = useState<GazeteVerisi | null>(null);
  const [podcast, setPodcast] = useState<PodcastVerisi | null>(null);

  // Derive counts
  const belgeSayisi = useMemo(() => {
    if (!belgeler.trim()) return 0;
    const matches = belgeler.match(/(?:^|\n)Belge\s*\d+/gi);
    return matches ? matches.length : 1;
  }, [belgeler]);

  // Suggested questions based on loaded document content
  const aktifOrnekSorular = useMemo(() => {
    const bulunanSet = ORNEK_BELGE_SETLERI.find((s) =>
      belgeler.toLowerCase().includes(s.belgeler[0].etiket.toLowerCase()) ||
      belgeler.toLowerCase().includes(s.baslik.toLowerCase().substring(0, 8))
    );
    if (bulunanSet) {
      return bulunanSet.ornekSorular;
    }
    return [
      "Belgelere göre alınan en önemli karar nedir?",
      "Metinlerde adı geçen kişiler bu konuda ne bildirmiştir?",
      "Belgelerde bahsedilmeyen bir konu hakkında ne söylenebilir?",
    ];
  }, [belgeler]);

  return (
    <div className="min-h-screen flex flex-col bg-stone-100 text-stone-900 selection:bg-amber-200">
      {/* Top Navigation */}
      <Navbar
        aktifSekme={aktifSekme}
        setAktifSekme={setAktifSekme}
        belgeSayisi={belgeSayisi}
        soruSayisi={roportajGecmisi.length}
        onYardimAc={() => setYardimAcik(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Hero Section (Visible only when in Belgeler section and user is starting out) */}
        {aktifSekme === "belgeler" && roportajGecmisi.length === 0 && (
          <div className="mb-8 no-print bg-gradient-to-r from-stone-900 via-stone-850 to-amber-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs font-semibold mb-4">
                <Feather className="w-3.5 h-3.5" />
                Tarih Dersi İçin Birincil Kaynak Atölyesi
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-black tracking-tight text-amber-100 mb-3 leading-tight">
                Tarih Muhabiri ile Geçmişin Belgelerine Kulak Verin
              </h1>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
                Öğretmen tarihî belgeleri yükler, öğrenciler soru sorar, yapay
                zekâ muhabirimiz yalnızca belgedeki kanıtlarla üçüncü şahıs
                olarak cevaplar. Ardından tek tıkla 1919 gazete sayfasına ve sesli
                podcaste dönüşür.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setAktifSekme("roportaj")}
                  className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                >
                  <span>Hemen Röportaja Başla</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setYardimAcik(true)}
                  className="px-4 py-3 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-200 font-medium text-sm transition-colors border border-stone-700 cursor-pointer"
                >
                  Pedagojik Kuralları İncele
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Section View with Motion Transition */}
        <AnimatePresence mode="wait">
          {aktifSekme === "belgeler" && (
            <motion.div
              key="belgeler"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <BelgelerBolumu
                belgeler={belgeler}
                setBelgeler={setBelgeler}
                onRoportajaGec={() => setAktifSekme("roportaj")}
              />
            </motion.div>
          )}

          {aktifSekme === "roportaj" && (
            <motion.div
              key="roportaj"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <RoportajBolumu
                belgeler={belgeler}
                roportajGecmisi={roportajGecmisi}
                setRoportajGecmisi={setRoportajGecmisi}
                onYayinaGec={() => setAktifSekme("yayin")}
                onBelgelereDon={() => setAktifSekme("belgeler")}
                ornekSorular={aktifOrnekSorular}
              />
            </motion.div>
          )}

          {aktifSekme === "yayin" && (
            <motion.div
              key="yayin"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <YayinBolumu
                belgeler={belgeler}
                roportajGecmisi={roportajGecmisi}
                gazete={gazete}
                setGazete={setGazete}
                podcast={podcast}
                setPodcast={setPodcast}
                onRoportajaDon={() => setAktifSekme("roportaj")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="no-print mt-auto border-t border-stone-200 bg-white py-6 text-stone-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-stone-800">
              Tarih Muhabiri
            </span>
            <span>—</span>
            <span>Tarih Dersi İçin Birincil Belge Analiz Uygulaması</span>
          </div>

          <div className="flex items-center gap-4 text-stone-600">
            <span className="flex items-center gap-1 text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5" />
              Kişisel Veri İstemez
            </span>
            <span>•</span>
            <button
              onClick={() => setYardimAcik(true)}
              className="hover:text-amber-800 underline underline-offset-2 cursor-pointer"
            >
              Kurallar &amp; Rehber
            </button>
          </div>
        </div>
      </footer>

      {/* Teacher Help Modal */}
      <YardimModal acik={yardimAcik} onKapat={() => setYardimAcik(false)} />
    </div>
  );
}
