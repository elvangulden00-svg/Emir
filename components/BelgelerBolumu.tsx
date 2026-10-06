// components/BelgelerBolumu.tsx
"use client";

import React, { useMemo } from "react";
import {
  ORNEK_BELGE_SETLERI,
  belgeSetiniMetneCevir,
  BelgeSeti,
} from "@/lib/ornekBelgeler";
import {
  FileText,
  Sparkles,
  RotateCcw,
  PlusCircle,
  ArrowRight,
  ShieldAlert,
  BookOpen,
  CheckCircle2,
} from "lucide-react";

interface BelgelerBolumuProps {
  belgeler: string;
  setBelgeler: (val: string) => void;
  onRoportajaGec: () => void;
}

export function BelgelerBolumu({
  belgeler,
  setBelgeler,
  onRoportajaGec,
}: BelgelerBolumuProps) {
  // Parse detected documents in the text
  const ayrilmisBelgeler = useMemo(() => {
    if (!belgeler.trim()) return [];
    // Split by lines starting with Belge 1, Belge 2 etc.
    const regex = /(?:^|\n)(Belge\s*\d+\s*:?)/gi;
    const parts = belgeler.split(regex).filter(Boolean);
    const result: Array<{ baslik: string; icerik: string }> = [];

    for (let i = 0; i < parts.length; i++) {
      if (/^Belge\s*\d+/i.test(parts[i].trim())) {
        const baslik = parts[i].trim().replace(/:$/, "");
        const icerik = (parts[i + 1] || "").trim();
        result.push({ baslik, icerik });
        i++; // skip content
      }
    }

    if (result.length === 0 && belgeler.trim().length > 0) {
      result.push({
        baslik: "Genel Belge Metni",
        icerik: belgeler.trim(),
      });
    }

    return result;
  }, [belgeler]);

  const ornekYukle = (set: BelgeSeti) => {
    const metin = belgeSetiniMetneCevir(set);
    setBelgeler(metin);
  };

  const sablonEkle = (belgeNo: number) => {
    const yeniBaslik = `\n\nBelge ${belgeNo}: [Belge Başlığı ve Tarihi]\nKaynak: [Arşiv veya Kitap Kaynağı]\n[Buraya tarihî belgenin metnini yapıştırınız...]`;
    setBelgeler(belgeler ? belgeler + yeniBaslik : `Belge 1: [Belge Başlığı]\nKaynak: [Arşiv]\n[Metin]`);
  };

  const kelimeSayisi = belgeler.trim() ? belgeler.trim().split(/\s+/).length : 0;
  const belgeSayisi = ayrilmisBelgeler.length;
  const yeterliBelgeVar = belgeSayisi >= 1 && kelimeSayisi > 30;

  return (
    <div className="space-y-6">
      {/* Introduction Hero Card */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 text-stone-100 shadow-sm relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/70 border border-amber-800/60 text-amber-300 text-xs font-medium mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            1. Bölüm: Birincil Tarihî Belgeler
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-amber-100 tracking-tight mb-2">
            Tarihî Belgeleri Yükleyin veya Düzenleyin
          </h1>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Öğrencilerinizin incelemesini istediğiniz 2-3 tarihî belge metnini
            buraya yapıştırın. Yapay zekâ muhabirimiz{" "}
            <strong className="text-amber-200">
              yalnızca bu metinlerdeki bilgileri
            </strong>{" "}
            esas alacak; genel tarih bilgisini katmayacak ve her cevabını belgelere
            dayandıracaktır.
          </p>
        </div>
      </div>

      {/* Preset Document Sets */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-stone-800 font-medium text-sm">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Ders İçin Hazır 1919 Belge Setleri (Tek Tıkla Yükle)</span>
          </div>
          <span className="text-xs text-stone-500">Müfredat Uyumlu</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {ORNEK_BELGE_SETLERI.map((set) => (
            <button
              key={set.id}
              onClick={() => ornekYukle(set)}
              type="button"
              className="text-left p-3.5 rounded-lg border border-stone-200 bg-stone-50/70 hover:bg-amber-50/60 hover:border-amber-300 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs text-amber-800 font-semibold mb-1">
                <span>{set.donem}</span>
                <span className="text-[11px] bg-amber-100/80 px-2 py-0.5 rounded text-amber-900">
                  {set.belgeler.length} Belge
                </span>
              </div>
              <h4 className="font-serif font-bold text-stone-900 text-sm group-hover:text-amber-950 mb-1 leading-snug">
                {set.baslik}
              </h4>
              <p className="text-xs text-stone-600 line-clamp-2">
                {set.aciklama}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Textarea & Controls */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-3">
          <div>
            <h3 className="font-serif font-bold text-stone-900 text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-700" />
              Belge Metin Alanı
            </h3>
            <p className="text-xs text-stone-500">
              Metinlerin başına &quot;Belge 1:&quot;, &quot;Belge 2:&quot;, &quot;Belge 3:&quot; etiketleri ekleyiniz.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => sablonEkle(belgeSayisi + 1)}
              className="px-2.5 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-700" />
              + Belge {belgeSayisi + 1} Başlığı Ekle
            </button>

            {belgeler && (
              <button
                type="button"
                onClick={() => setBelgeler("")}
                className="px-2.5 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Temizle
              </button>
            )}
          </div>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            value={belgeler}
            onChange={(e) => setBelgeler(e.target.value)}
            rows={14}
            placeholder={`Belge 1: Amasya Tamimi Maddeleri (22 Haziran 1919)
Kaynak: Askerî Tarih Belgeleri Dergisi
1. Vatanın bütünlüğü, milletin bağımsızlığı tehlikededir...
2. Milletin bağımsızlığını yine milletin azim ve kararı kurtaracaktır...

Belge 2: Dahiliye Nezareti Genelgesi (23 Haziran 1919)
Kaynak: Başbakanlık Osmanlı Arşivi
Mustafa Kemal Paşa görev sınırını aşmıştır... Memuriyeti lağvedilmiştir...

Belge 3: Kâzım Karabekir Paşa'nın Destek Telgrafı (24 Haziran 1919)
Kaynak: İstiklal Harbimiz
15. Kolordu milletin ve zatıâlinizin emirlerini beklemektedir...`}
            className="w-full p-4 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-stone-900 font-mono text-sm leading-relaxed bg-stone-50/50 resize-y"
          />
        </div>

        {/* Status Indicators & Next Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-4 text-xs text-stone-600 flex-wrap">
            <span className="flex items-center gap-1 font-medium">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  belgeSayisi >= 2
                    ? "bg-emerald-500"
                    : belgeSayisi === 1
                    ? "bg-amber-500"
                    : "bg-stone-300"
                }`}
              />
              Algılanan Belge:{" "}
              <strong className="text-stone-900">{belgeSayisi} adet</strong>
            </span>
            <span>•</span>
            <span>
              Kelime Sayısı:{" "}
              <strong className="text-stone-900">{kelimeSayisi}</strong>
            </span>
            {belgeSayisi < 2 && (
              <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Tavsiye: En az 2 tarihî belge girilmesi önerilir.
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onRoportajaGec}
            disabled={!yeterliBelgeVar}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              yeterliBelgeVar
                ? "bg-amber-700 hover:bg-amber-800 text-white shadow-md hover:shadow-lg"
                : "bg-stone-200 text-stone-400 cursor-not-allowed"
            }`}
          >
            <span>2. Bölüm: Röportaja Başla</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Document Inspector Cards */}
      {ayrilmisBelgeler.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-stone-800 text-base">
              Yüklenen Belgelerin İncelenmesi ({ayrilmisBelgeler.length} Belge)
            </h3>
            <span className="text-xs text-stone-500">
              Muhabir atıf yaparken bu etiketleri kullanacaktır.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ayrilmisBelgeler.map((b, idx) => (
              <div
                key={idx}
                className="bg-amber-50/40 border border-amber-200/80 rounded-xl p-4 flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-950 border border-amber-300">
                      [{b.baslik}]
                    </span>
                    <span className="text-[11px] text-stone-500">
                      {b.icerik.split(/\s+/).filter(Boolean).length} kelime
                    </span>
                  </div>
                  <p className="text-xs text-stone-700 line-clamp-6 leading-relaxed whitespace-pre-line font-serif italic">
                    &quot;{b.icerik || "(İçerik boş)"}&quot;
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-amber-200/60 flex items-center text-[11px] text-amber-900 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  Muhabir incelemesine hazır
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Teacher Instruction Card */}
      <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs text-stone-600 flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-stone-800">
            Pedagojik ve Etik Not (Öğrenci Gizliliği &amp; Kaynak Eleştirisi):
          </p>
          <p>
            Bu uygulama öğrencilerden ad, soyad veya numara talep etmez. Öğretmen
            sınıfta soruları toplayarak doğrudan arayüze aktarabilir. Tarih
            muhabirimiz, öğrencilere birincil kaynaklara dayanarak sorgulama ve
            eleştirel tarih okuma becerisi kazandırmak üzere tasarlanmıştır.
          </p>
        </div>
      </div>
    </div>
  );
}
