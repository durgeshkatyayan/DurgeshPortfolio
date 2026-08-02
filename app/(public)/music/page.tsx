"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { IMusic } from "@/models/Music";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Music as MusicIcon,
  Disc,
  ListMusic,
  Radio,
  Sparkles,
} from "lucide-react";

const CATEGORIES = ["All", "Turkish", "Indian", "English", "Russian", "Bhojpuri", "Bhakti", "Other"];

export default function MusicPage() {
  const [songs, setSongs] = useState<IMusic[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [prevVolume, setPrevVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch Songs on Category Change
  useEffect(() => {
    const fetchSongs = async () => {
      setIsLoading(true);
      try {
        const url =
          selectedCategory === "All"
            ? "/api/music"
            : `/api/music?genre=${encodeURIComponent(selectedCategory)}`;
        const res = await fetch(url);
        const json = await res.json();

        if (json.success) {
          setSongs(json.data);
          setCurrentSongIndex(json.data.length > 0 ? 0 : null);
          setIsPlaying(false);
        }
      } catch (err) {
        console.error("Failed to load music:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSongs();
  }, [selectedCategory]);

  const currentSong =
    currentSongIndex !== null && songs[currentSongIndex] ? songs[currentSongIndex] : null;

  // Audio Event Listeners & Volume Sync
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnded = () => handleNext();

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentSongIndex, songs]);

  // Sync volume with element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Handle Play/Pause
  const togglePlay = () => {
    if (!audioRef.current || !currentSong) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Playback interrupted:", err));
    }
  };

  const playSong = (index: number) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.log("Playback failed:", err));
      }
    }, 100);
  };

  const handleNext = () => {
    if (songs.length === 0 || currentSongIndex === null) return;
    const nextIdx = (currentSongIndex + 1) % songs.length;
    playSong(nextIdx);
  };

  const handlePrev = () => {
    if (songs.length === 0 || currentSongIndex === null) return;
    const prevIdx = (currentSongIndex - 1 + songs.length) % songs.length;
    playSong(prevIdx);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(prevVolume || 0.8);
    } else {
      setPrevVolume(volume);
      setIsMuted(true);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="min-h-screen text-slate-100 pb-28 space-y-8 max-w-6xl mx-auto px-4 sm:px-6 pt-6">
      {/* Dynamic Audio Element */}
      {currentSong && <audio ref={audioRef} src={currentSong.audioUrl} preload="metadata" />}

      {/* Top Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/20 to-neutral-900 border border-white/10 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600/20 border border-blue-500/30 rounded-2xl text-blue-400">
              <Disc className={`w-8 h-8 ${isPlaying ? "animate-spin" : ""}`} style={{ animationDuration: "8s" }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 flex items-center gap-1">
                  <Sparkles size={12} /> Audio Hub
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">Music Collection</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-400 bg-neutral-900/80 border border-neutral-800 px-3.5 py-2 rounded-xl self-start md:self-auto">
            <Radio size={14} className="text-emerald-400 animate-pulse" /> Live Streaming Ready
          </div>
        </div>
      </div>

      {/* Category Selection Filter Pills */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-medium text-neutral-400 px-1">
          <span>Categories</span>
          <span>{songs.length} Tracks Available</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/40 scale-105"
                    : "bg-neutral-900/80 text-neutral-400 hover:bg-neutral-800 hover:text-slate-200 border border-neutral-800/80"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Glassmorphism Player Container */}
      {currentSong ? (
        <div className="relative overflow-hidden rounded-3xl bg-neutral-900/90 border border-neutral-800 p-6 md:p-8 shadow-2xl backdrop-blur-2xl transition-all duration-500">
          {/* Ambient Blurred Background Glow */}
          <div
            className="absolute inset-0 opacity-20 blur-3xl pointer-events-none transition-all duration-700"
            style={{
              backgroundImage: `url(${currentSong.coverImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            {/* Album Cover Art */}
            <div className="relative group shrink-0">
              <div className={`relative w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-2xl border border-white/10 transition-transform duration-500 ${isPlaying ? "scale-100" : "scale-95"}`}>
                <Image
                  src={currentSong.coverImage || "/placeholder.png"}
                  alt={currentSong.title ?? "Cover"}
                  fill
                  sizes="(max-width: 768px) 192px, 224px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              </div>
              {/* Equalizer overlay indicator when playing */}
              {isPlaying && (
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-lg flex items-end gap-1 border border-white/10">
                  <span className="w-1 h-3 bg-blue-500 animate-bounce rounded-full" />
                  <span className="w-1 h-4 bg-blue-400 animate-bounce rounded-full [animation-delay:0.2s]" />
                  <span className="w-1 h-2 bg-blue-500 animate-bounce rounded-full [animation-delay:0.4s]" />
                </div>
              )}
            </div>

            {/* Song Meta & Playback Controls */}
            <div className="flex-1 w-full space-y-5">
              <div className="space-y-1 text-center md:text-left">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {currentSong.genre || currentSong.genre || "Unknown Genre"}
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white truncate">{currentSong.title}</h2>
                <p className="text-sm font-medium text-neutral-400">{currentSong.artist}</p>
              </div>

              {/* Progress Bar Component */}
              <div className="space-y-2">
                <div className="relative group">
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
                  />
                </div>
                <div className="flex justify-between text-xs font-mono text-neutral-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Interactive Buttons Bar */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handlePrev}
                    className="p-3 text-neutral-400 hover:text-white hover:bg-neutral-800/80 rounded-2xl transition"
                    title="Previous Track"
                  >
                    <SkipBack size={22} />
                  </button>

                  <button
                    onClick={togglePlay}
                    className="w-14 h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    {isPlaying ? <Pause size={26} /> : <Play size={26} className="ml-1" />}
                  </button>

                  <button
                    onClick={handleNext}
                    className="p-3 text-neutral-400 hover:text-white hover:bg-neutral-800/80 rounded-2xl transition"
                    title="Next Track"
                  >
                    <SkipForward size={22} />
                  </button>
                </div>

                {/* Volume Slider Section */}
                <div className="flex items-center gap-3 bg-neutral-950/40 border border-neutral-800 px-3.5 py-2 rounded-2xl">
                  <button onClick={toggleMute} className="text-neutral-400 hover:text-white transition">
                    {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-16 sm:w-24 h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-16 text-center text-neutral-400 bg-neutral-900/40 rounded-3xl border border-neutral-800/80 backdrop-blur-md">
          <MusicIcon size={40} className="mx-auto text-neutral-600 mb-3" />
          <p className="text-base font-semibold text-neutral-300">No tracks found</p>
          <p className="text-xs text-neutral-500 mt-1">Try switching to a different category or upload music from the admin dashboard.</p>
        </div>
      )}

      {/* Animated Interactive Playlist Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-200 font-bold text-lg">
          <ListMusic size={20} className="text-blue-500" />
          <h3>Playlist Overview</h3>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[1, 2, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-neutral-900/60 rounded-2xl border border-neutral-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {songs.map((song: IMusic, index: number) => {
              const isCurrent = currentSongIndex === index;

              return (
                <div
                  key={song._id as any}
                  onClick={() => playSong(index)}
                  className={`group relative flex items-center gap-4 p-3.5 rounded-2xl cursor-pointer border transition-all duration-300 ${
                    isCurrent
                      ? "bg-blue-600/10 border-blue-500/40 text-white shadow-lg shadow-blue-500/5"
                      : "bg-neutral-900/60 border-neutral-800/80 hover:bg-neutral-800/60 hover:border-neutral-700/80 text-neutral-300"
                  }`}
                >
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/5">
                    <Image
                      src={song.coverImage || "/placeholder.png"}
                      alt={song.title || "Cover"}
                      fill
                      sizes="56px"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {isCurrent && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center">
                        <MusicIcon size={18} className="text-blue-400 animate-pulse" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-semibold truncate ${isCurrent ? "text-blue-400" : "text-slate-100"}`}>
                      {song.title}
                    </h4>
                    <p className="text-xs text-neutral-400 truncate mt-0.5">{song.artist}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-neutral-500">
                      {song.duration || "--:--"}
                    </span>
                    <div className={`p-2 rounded-xl transition ${isCurrent ? "bg-blue-600 text-white" : "bg-neutral-800/60 text-neutral-400 group-hover:text-white"}`}>
                      {isCurrent && isPlaying ? <Pause size={14} /> : <Play size={14} />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}