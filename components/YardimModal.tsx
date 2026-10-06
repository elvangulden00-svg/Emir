// components/YardimModal.tsx
"use client";

import React from "react";
import { X, ShieldCheck, CheckCircle2, Feather, Newspaper, Radio } from "lucide-react";

interface YardimModalProps {
  acik: boolean;
  onKapat: () => void;
}

export function YardimModal({ acik, onKapat }: YardimModalProps) {
  if (!acik) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-stone-200 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col font-sans">
        {/* Header */}
        <div className="bg-stone-900 text-stone-100 p-5 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white">
              <Feather className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-amber-100">
                Tarih Muhabiri Kuralları &amp; İlkeleri
              </h3>
              <p className="text-xs text-stone-400">
                Öğretmen Rehberi ve Pedagojik Standartlar
              </p>
            </div>
          </div>
          <button
            onClick={onKapat}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-stone-700 leading-relaxed">
          {/* Reporter Rules */}
          <div className="space-y-3">
            <h4 className="font-bold text-stone-900 flex items-center gap-2 text-base">
              <CheckCircle2 className="w-4 h-4 text-amber-700" />
              Tarih Muhabiri Çalışma Kuralları
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm pl-2">
              <li className="flex items-start gap-2">
                <span className="font-bold text-amber-800 shrink-0">•</span>
                <span>
                  <strong>Muhabir Kimliği:</strong> Tarihî kişileri canlandırmaz, onların ağzından konuşmaz. Her zaman üçüncü şahısla anlatır (<em>&quot;Mustafa Kemal Paşa genelgede ... bildirdi&quot;</em>).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-amber-800 shrink-0">•</span>
                <span>
                  <strong>Belgelere Sadakat:</strong> Yalnızca yüklenen belgelerdeki bilgiyi kullanır, kendi genel bilgisini eklemez.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-amber-800 shrink-0">•</span>
                <span>
                  <strong>Zorunlu Belge Atfı:</strong> Her cevabın sonuna dayandığı belgeyi ekler (<em>[Belge 1]</em>, <em>[Belge 2]</em>).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-amber-800 shrink-0">•</span>
                <span>
                  <strong>Birebir Alıntılar:</strong> Söz aktarırken belgedeki cümleyi tırnak içinde hiç değiştirmeden aktarır. Asla söz uydurmaz.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-amber-800 shrink-0">•</span>
                <span>
                  <strong>Belgede Olmayan Bilgiler:</strong> Cevap belgelerde yoksa şunu söyler: <em>&quot;Bu belgelerde bu sorunun cevabı yok. Ders kitabınızda veya başka bir birincil kaynakta araştırabilirsiniz.&quot;</em>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-amber-800 shrink-0">•</span>
                <span>
                  <strong>Cevap Uzunluğu:</strong> En fazla 5 cümle, 7-12. sınıf düzeyine uygun akıcı Türkçe.
                </span>
              </li>
            </ul>
          </div>

          {/* Newspaper & Podcast Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-stone-900 text-xs">
                <Newspaper className="w-4 h-4 text-amber-700" />
                1919 Gazete Sayfası
              </div>
              <p className="text-xs text-stone-600">
                Manşet, spot, haber metni, belgelerden birebir alıntılar ve 3 kontrol sorusuyla arşiv niteliğinde baskı.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-stone-900 text-xs">
                <Radio className="w-4 h-4 text-amber-700" />
                1 Dakikalık Podcast
              </div>
              <p className="text-xs text-stone-600">
                Muhabir ve Tarihçi arasında iki sesli sohbet. Tarihçi de tarihî kişileri canlandırmaz, üçüncü şahısla anlatır.
              </p>
            </div>
          </div>

          {/* Student Privacy */}
          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900 text-xs flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong>Kişisel Veri Güvenliği:</strong> Bu uygulama öğrenci adı, soyadı, okul numarası gibi hiçbir kişisel veri toplamaz veya saklamaz. Tamamen ders içi pedagojik kaynak analizine odaklıdır.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onKapat}
            className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-100 text-xs font-semibold transition-colors cursor-pointer"
          >
            Anladım, Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
