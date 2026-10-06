// components/Navbar.tsx
"use client";

import React from "react";
import { Newspaper, Mic, FileText, Sparkles, Feather, HelpCircle } from "lucide-react";

interface NavbarProps {
  aktifSekme: "belgeler" | "roportaj" | "yayin";
  setAktifSekme: (sekme: "belgeler" | "roportaj" | "yayin") => void;
  belgeSayisi: number;
  soruSayisi: number;
  onYardimAc: () => void;
}

export function Navbar({
  aktifSekme,
  setAktifSekme,
  belgeSayisi,
  soruSayisi,
  onYardimAc,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-stone-900 text-stone-100 border-b border-stone-800 shadow-md no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & App Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setAktifSekme("belgeler")}>
            <div className="w-10 h-10 rounded-lg bg-amber-600/90 flex items-center justify-center text-amber-100 shadow-inner">
              <Feather className="w-5 h-5 text-amber-100" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif text-xl font-bold tracking-tight text-amber-100">
                  Tarih Muhabiri
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60">
                  1919 Atölyesi
                </span>
              </div>
              <p className="text-xs text-stone-400 hidden sm:block">
                Birincil Belgelere Dayalı Tarih Röportajı, Gazete ve Podcast
              </p>
            </div>
          </div>

          {/* Navigation Tabs (3 Sections) */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setAktifSekme("belgeler")}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                aktifSekme === "belgeler"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-stone-300 hover:text-white hover:bg-stone-800"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>1. Belgeler</span>
              {belgeSayisi > 0 && (
                <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-stone-800 text-amber-200 border border-stone-700">
                  {belgeSayisi}
                </span>
              )}
            </button>

            <button
              onClick={() => setAktifSekme("roportaj")}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                aktifSekme === "roportaj"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-stone-300 hover:text-white hover:bg-stone-800"
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>2. Röportaj</span>
              {soruSayisi > 0 && (
                <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-stone-800 text-amber-200 border border-stone-700">
                  {soruSayisi}
                </span>
              )}
            </button>

            <button
              onClick={() => setAktifSekme("yayin")}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                aktifSekme === "yayin"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-stone-300 hover:text-white hover:bg-stone-800"
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>3. Yayın</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            </button>
          </nav>

          {/* Help & Teacher Guide */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onYardimAc}
              title="Öğretmen Rehberi ve Kurallar"
              className="p-2 text-stone-400 hover:text-amber-200 hover:bg-stone-800 rounded-lg transition-colors text-xs flex items-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden md:inline text-xs">Kurallar</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
