"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatTime } from "./utils";

interface VideoPlayerProps {
  src: string;
}

export function VideoPlayer({ src }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState(false);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => {
      setCurrent(v.currentTime);
      setProgress(v.duration ? (v.currentTime / v.duration) * 100 : 0);
    };
    const onLoaded = () => setDuration(v.duration);
    const onEnded = () => setPlaying(false);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onLoaded);
    v.addEventListener("ended", onEnded);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onLoaded);
      v.removeEventListener("ended", onEnded);
    };
  }, []);

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const rect = e.currentTarget.getBoundingClientRect();
    v.currentTime = ((e.clientX - rect.left) / rect.width) * v.duration;
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted(!muted);
  };

  return (
    <div
      className="relative w-full bg-zinc-950 rounded-xl overflow-hidden group/video"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full max-h-110 object-contain"
        preload="metadata"
        onClick={toggle}
      />

      {/* Big play overlay — hidden once playing */}
      {!playing && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/30 transition-opacity duration-200"
          onClick={toggle}
        >
          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg transition-transform duration-150 hover:scale-105 hover:bg-white">
            <Play className="w-5 h-5 text-zinc-900 ml-0.5" fill="currentColor" />
          </div>
        </div>
      )}

      {/* Controls bar — visible on hover when playing */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 px-4 py-3 flex items-center gap-3 transition-opacity duration-200",
          "bg-linear-to-t from-black/70 to-transparent",
          playing && hovered ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <button
          onClick={toggle}
          className="text-white/90 hover:text-white transition-colors"
        >
          {playing ? (
            <Pause className="w-4 h-4" fill="currentColor" />
          ) : (
            <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
          )}
        </button>

        {/* Progress bar */}
        <div
          className="flex-1 h-0.75 rounded-full bg-white/25 cursor-pointer relative"
          onClick={seek}
        >
          <div
            className="absolute inset-y-0 left-0 bg-white rounded-full transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="text-white/70 text-[11px] tabular-nums whitespace-nowrap">
          {formatTime(current)} / {formatTime(duration)}
        </span>

        <button
          onClick={toggleMute}
          className="text-white/90 hover:text-white transition-colors"
        >
          {muted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}