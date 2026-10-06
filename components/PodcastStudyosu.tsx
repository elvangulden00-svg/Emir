// components/PodcastStudyosu.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  FileText,
  Radio,
  Sparkles,
  UserCheck,
  Headphones,
  CheckCircle2,
} from "lucide-react";

export interface PodcastVerisi {
  title: string;
  summary?: string;
  dialogue: Array<{
    speaker: "Muhabir" | "Tarihçi";
    text: string;
  }>;
  audioBase64?: string | null;
  mimeType?: string;
  ttsErrorDetail?: string | null;
}

interface PodcastStudyosuProps {
  podcast: PodcastVerisi;
  onYenidenKaydet: () => void;
  yukleniyor: boolean;
}

export function PodcastStudyosu({
  podcast,
  onYenidenKaydet,
  yukleniyor,
}: PodcastStudyosuProps) {
  const [oynatiliyor, setOynatiliyor] = useState(false);
  const [gecenSure, setGecenSure] = useState(0);
  const [toplamSure, setToplamSure] = useState(60);
  const [hiz, setHiz] = useState(1);
  const [sesSeviyesi, setSesSeviyesi] = useState(1);
  const [susturuldu, setSusturuldu] = useState(false);
  const [aktifReplikIdx, setAktifReplikIdx] = useState<number>(-1);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio if base64 is present
  useEffect(() => {
    if (podcast.audioBase64) {
      const src = `data:${podcast.mimeType || "audio/wav"};base64,${podcast.audioBase64}`;
      const audio = new Audio(src);
      audioRef.current = audio;

      audio.onloadedmetadata = () => {
        if (audio.duration && !isNaN(audio.duration) && audio.duration !== Infinity) {
          setToplamSure(Math.round(audio.duration));
        }
      };

      audio.ontimeupdate = () => {
        setGecenSure(audio.currentTime);
        // Estimate line index based on time ratio
        const oran = audio.duration ? audio.currentTime / audio.duration : 0;
        const lineIdx = Math.min(
          Math.floor(oran * podcast.dialogue.length),
          podcast.dialogue.length - 1
        );
        setAktifReplikIdx(lineIdx);
      };

      audio.onended = () => {
        setOynatiliyor(false);
        setGecenSure(0);
        setAktifReplikIdx(-1);
      };

      return () => {
        audio.pause();
        audio.src = "";
      };
    }
  }, [podcast.audioBase64, podcast.mimeType, podcast.dialogue.length]);

  // Clean up browser speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const oynatDurdur = () => {
    if (oynatiliyor) {
      durdur();
    } else {
      baslat();
    }
  };

  const baslat = () => {
    if (podcast.audioBase64 && audioRef.current) {
      audioRef.current.playbackRate = hiz;
      audioRef.current.volume = susturuldu ? 0 : sesSeviyesi;
      audioRef.current.play().then(() => {
        setOynatiliyor(true);
      }).catch((e) => {
        console.warn("WAV çalma hatası, Web Speech API'ye geçiliyor:", e);
        tarayiciSeslendirmesiBaslat();
      });
    } else {
      // Play via Browser Speech Synthesis
      tarayiciSeslendirmesiBaslat();
    }
  };

  const durdur = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setOynatiliyor(false);
  };

  const tarayiciSeslendirmesiBaslat = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Tarayıcınız ses sentezini desteklemiyor.");
      return;
    }

    window.speechSynthesis.cancel();
    setOynatiliyor(true);

    const replikler = podcast.dialogue;
    let index = aktifReplikIdx >= 0 && aktifReplikIdx < replikler.length ? aktifReplikIdx : 0;

    const seslendirSiradaki = () => {
      if (index >= replikler.length) {
        setOynatiliyor(false);
        setAktifReplikIdx(-1);
        setGecenSure(0);
        return;
      }

      setAktifReplikIdx(index);
      const item = replikler[index];
      const u = new SpeechSynthesisUtterance(item.text);
      u.lang = "tr-TR";
      u.rate = hiz;

      // Give distinct voices / pitch to Muhabir vs Tarihçi
      if (item.speaker === "Muhabir") {
        u.pitch = 1.15; // slightly higher, energetic reporter
      } else {
        u.pitch = 0.85; // slightly deeper, calm historian
      }

      const voices = window.speechSynthesis.getVoices();
      const trVoices = voices.filter((v) => v.lang.startsWith("tr"));
      if (trVoices.length >= 2) {
        u.voice = item.speaker === "Muhabir" ? trVoices[0] : trVoices[1];
      } else if (trVoices.length === 1) {
        u.voice = trVoices[0];
      }

      u.onend = () => {
        index++;
        seslendirSiradaki();
      };

      u.onerror = () => {
        index++;
        seslendirSiradaki();
      };

      window.speechSynthesis.speak(u);
    };

    seslendirSiradaki();
  };

  const basaSar = () => {
    durdur();
    setGecenSure(0);
    setAktifReplikIdx(-1);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const hizDegistir = () => {
    const sonrakiHiz = hiz === 1 ? 1.25 : hiz === 1.25 ? 1.5 : 1;
    setHiz(sonrakiHiz);
    if (audioRef.current) {
      audioRef.current.playbackRate = sonrakiHiz;
    }
  };

  const sesIndir = () => {
    if (!podcast.audioBase64) return;
    const downloadLink = document.createElement("a");
    downloadLink.href = `data:${podcast.mimeType || "audio/wav"};base64,${podcast.audioBase64}`;
    downloadLink.download = `${podcast.title.replace(/\s+/g, "_")}.wav`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
  };

  const metinIndir = () => {
    const icerik = `${podcast.title}\n${"=".repeat(podcast.title.length)}\n\n` +
      podcast.dialogue.map((d) => `[${d.speaker}]: ${d.text}`).join("\n\n");
    const blob = new Blob([icerik], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tarih-podcast-metni.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatZaman = (s: number) => {
    const dak = Math.floor(s / 60);
    const san = Math.floor(s % 60);
    return `${dak}:${san < 10 ? "0" : ""}${san}`;
  };

  return (
    <div className="space-y-6">
      {/* Studio Header Card */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 text-stone-100 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/70 border border-amber-800/60 text-amber-300 text-xs font-medium mb-3">
              <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              Tarih Muhabiri Podcast Stüdyosu (1 Dakikalık Yayın)
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-amber-100 tracking-tight mb-2">
              {podcast.title}
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              İki farklı hazır sesle diyalog:{" "}
              <strong className="text-amber-200">Muhabir</strong> ve{" "}
              <strong className="text-amber-200">Tarihçi</strong>. Tarihçi de
              tarihî kişileri canlandırmaz, onları üçüncü şahısla ve belgelere
              dayanarak nesnel anlatır.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {podcast.audioBase64 && (
              <button
                onClick={sesIndir}
                className="px-3 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>WAV İndir</span>
              </button>
            )}

            <button
              onClick={metinIndir}
              className="px-3 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Metni İndir</span>
            </button>

            <button
              onClick={onYenidenKaydet}
              disabled={yukleniyor}
              className="px-3.5 py-2 rounded-lg bg-amber-700 hover:bg-amber-600 text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              {yukleniyor ? "Kaydediliyor..." : "Yeniden Kaydet"}
            </button>
          </div>
        </div>

        {/* Audio Player Bar */}
        <div className="mt-6 pt-6 border-t border-stone-800/80">
          <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row items-center gap-4">
            {/* Play / Pause / Reset Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={oynatDurdur}
                className="w-12 h-12 rounded-full bg-amber-600 hover:bg-amber-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
                title={oynatiliyor ? "Durdur" : "Oynat"}
              >
                {oynatiliyor ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </button>

              <button
                onClick={basaSar}
                className="p-2.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-900 transition-colors cursor-pointer"
                title="Başa sar"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Time and Progress Scrubber */}
            <div className="flex-1 w-full flex items-center gap-3">
              <span className="font-mono text-xs text-stone-400 min-w-[36px]">
                {formatZaman(gecenSure)}
              </span>

              {/* Progress Bar with Waveform animation */}
              <div className="flex-1 relative flex items-center h-8">
                <div className="w-full bg-stone-800 rounded-full h-2 overflow-hidden relative">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-200"
                    style={{
                      width: `${Math.min(100, (gecenSure / (toplamSure || 60)) * 100)}%`,
                    }}
                  />
                </div>

                {/* Animated Waveform indicator when playing */}
                {oynatiliyor && (
                  <div className="absolute right-0 flex items-end gap-0.5 h-4 pointer-events-none">
                    <span className="w-1 bg-amber-400 rounded animate-bounce [animation-delay:-0.3s] h-3" />
                    <span className="w-1 bg-amber-400 rounded animate-bounce [animation-delay:-0.1s] h-4" />
                    <span className="w-1 bg-amber-400 rounded animate-bounce [animation-delay:-0.2s] h-2" />
                    <span className="w-1 bg-amber-400 rounded animate-bounce h-3.5" />
                  </div>
                )}
              </div>

              <span className="font-mono text-xs text-stone-400 min-w-[36px]">
                {formatZaman(toplamSure)}
              </span>
            </div>

            {/* Speed & Volume Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={hizDegistir}
                className="px-2.5 py-1 rounded bg-stone-800 text-stone-300 hover:text-white font-mono text-xs transition-colors cursor-pointer"
                title="Oynatma Hızı"
              >
                {hiz}x
              </button>

              <button
                onClick={() => setSusturuldu(!susturuldu)}
                className="text-stone-400 hover:text-stone-200 cursor-pointer"
              >
                {susturuldu ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Audio Source Status Tag */}
          <div className="mt-3 flex items-center justify-between text-[11px] text-stone-400">
            <span className="flex items-center gap-1.5">
              <Headphones className="w-3.5 h-3.5 text-amber-400" />
              {podcast.audioBase64
                ? "Gemini TTS (Doğal Türkçe İki Sesli Seslendirme)"
                : "Çok Sesli Sentez Modu Aktif"}
            </span>
            <span className="text-emerald-400 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3 h-3" />
              1 Dakikalık Yayın Formatı
            </span>
          </div>
        </div>
      </div>

      {/* Synchronized Script Dialogue (Karaoke Style) */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <h3 className="font-serif font-bold text-stone-900 text-lg">
              Podcast Diyalog Metni (Replik Replik Takip Edin)
            </h3>
          </div>
          <span className="text-xs text-stone-500">
            {podcast.dialogue.length} Replik
          </span>
        </div>

        <div className="space-y-3">
          {podcast.dialogue.map((item, index) => {
            const isReporter = item.speaker === "Muhabir";
            const isCurrent = aktifReplikIdx === index;

            return (
              <div
                key={index}
                onClick={() => {
                  setAktifReplikIdx(index);
                  if (oynatiliyor) {
                    // Jump to that section
                    const oran = index / podcast.dialogue.length;
                    if (audioRef.current && audioRef.current.duration) {
                      audioRef.current.currentTime = oran * audioRef.current.duration;
                    }
                  }
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-amber-50/90 border-amber-400 shadow-sm ring-2 ring-amber-300/40"
                    : isReporter
                    ? "bg-stone-50/70 border-stone-200 hover:border-amber-300"
                    : "bg-amber-50/30 border-stone-200 hover:border-amber-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isReporter
                          ? "bg-stone-800 text-stone-100"
                          : "bg-amber-700 text-amber-100"
                      }`}
                    >
                      {item.speaker}
                    </span>
                    <span className="text-[11px] text-stone-500 font-sans">
                      {isReporter
                        ? "Haber Muhabiri Sunucusu"
                        : "Tarihçi & Araştırmacı (3. Şahıs Anlatıcı)"}
                    </span>
                  </div>

                  {isCurrent && (
                    <span className="text-[11px] font-medium text-amber-800 animate-pulse flex items-center gap-1">
                      <Volume2 className="w-3 h-3" />
                      Okunuyor...
                    </span>
                  )}
                </div>

                <p
                  className={`text-sm sm:text-base leading-relaxed ${
                    isCurrent
                      ? "font-medium text-stone-900"
                      : "text-stone-800"
                  }`}
                >
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>

        {/* Historian pedagogical note */}
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 text-xs text-stone-600 flex items-start gap-2.5">
          <UserCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong>Pedagojik Hatırlatma:</strong> Tarihçi karakteri tarihî
            figürlerin ağzından konuşmamakta; olayları ve belgeleri üçüncü şahısla
            anlatarak tarihsel nesnelliği korumaktadır.
          </div>
        </div>
      </div>
    </div>
  );
}
