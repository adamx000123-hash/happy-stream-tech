import { useEffect, useRef, useState } from "react";
import { Music2, Pause, Play, SkipForward, Volume2, VolumeX } from "lucide-react";
import { tracks } from "@/lib/tracks";

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [blocked, setBlocked] = useState(false);

  const current = tracks[index];

  // تشغيل تلقائي بصوت مناسب
  useEffect(() => {
    const el = audioRef.current;
    if (!el || !current) return;
    el.volume = 0.25;
    el.play()
      .then(() => {
        setPlaying(true);
        setBlocked(false);
      })
      .catch(() => {
        setPlaying(false);
        setBlocked(true);
      });
  }, [index, current]);

  // بعض المتصفحات تمنع التشغيل التلقائي: نبدأ عند أول تفاعل
  useEffect(() => {
    if (!blocked) return;
    const start = () => {
      audioRef.current?.play().then(() => {
        setPlaying(true);
        setBlocked(false);
      }).catch(() => {});
    };
    window.addEventListener("pointerdown", start, { once: true });
    window.addEventListener("keydown", start, { once: true });
    return () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
    };
  }, [blocked]);

  if (!current) return null;

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  const next = () => setIndex((i) => (i + 1) % tracks.length);

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-fade-in" dir="rtl">
      <audio ref={audioRef} src={current.src} onEnded={next} loop={tracks.length === 1} />

      <div className="surface-card flex items-center gap-1.5 rounded-full px-2 py-1.5 backdrop-blur-md">
        <button
          onClick={toggle}
          aria-label={playing ? "إيقاف الموسيقى" : "تشغيل الموسيقى"}
          className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 active:scale-95"
        >
          {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
        </button>

        <button
          onClick={next}
          aria-label="الأغنية التالية"
          disabled={tracks.length < 2}
          className="grid size-9 place-items-center rounded-full bg-secondary/80 text-foreground transition-transform hover:scale-105 active:scale-95 disabled:opacity-40"
        >
          <SkipForward className="size-4" />
        </button>

        <span className="flex max-w-[10rem] items-center gap-1.5 truncate px-2 text-[11px] text-muted-foreground">
          {playing ? (
            <Volume2 className="size-3.5 shrink-0 text-gold" />
          ) : blocked ? (
            <VolumeX className="size-3.5 shrink-0 text-gold" />
          ) : (
            <Music2 className="size-3.5 shrink-0 text-gold" />
          )}
          <span className="truncate">{current.title}</span>
        </span>
      </div>
    </div>
  );
}
