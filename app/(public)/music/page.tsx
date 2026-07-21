"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Play, Pause, FastForward, Rewind } from "lucide-react";
import Image from "next/image";

interface Track {
  _id: string;
  songName: string;
  artist: string;
  coverImage: string;
  audioUrl: string;
  genre: string;
}

export default function MusicPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const { data } = await axios.get("/api/music");
        setTracks(data);
        if (data.length > 0) setCurrentTrack(data[0]);
      } catch (error) {
        console.error("Error fetching music", error);
      }
    };
    fetchMusic();
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playSpecificTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setTimeout(() => {
      if (audioRef.current) audioRef.current.play();
    }, 100);
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white py-24 px-6 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
        My Playlists
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Now Playing Section */}
        <div className="md:col-span-2">
          {currentTrack && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl flex flex-col items-center">
              <div className="relative w-64 h-64 rounded-2xl overflow-hidden mb-8 shadow-2xl">
                <Image src={currentTrack.coverImage} alt={currentTrack.songName} fill className="object-cover" />
              </div>
              
              <h2 className="text-2xl font-bold mb-1">{currentTrack.songName}</h2>
              <p className="text-neutral-400 mb-8">{currentTrack.artist}</p>

              <audio 
                ref={audioRef} 
                src={currentTrack.audioUrl} 
                onEnded={() => setIsPlaying(false)}
              />

              <div className="flex items-center gap-6">
                <button className="text-neutral-400 hover:text-white transition">
                  <Rewind size={32} />
                </button>
                <button 
                  onClick={togglePlay}
                  className="bg-white text-black p-4 rounded-full hover:scale-105 transition transform"
                >
                  {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                </button>
                <button className="text-neutral-400 hover:text-white transition">
                  <FastForward size={32} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tracklist Sidebar */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold mb-6 border-b border-neutral-800 pb-2">Up Next</h3>
          {tracks.map((track) => (
            <div 
              key={track._id} 
              onClick={() => playSpecificTrack(track)}
              className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition ${
                currentTrack?._id === track._id ? 'bg-white/10 border border-white/20' : 'hover:bg-white/5'
              }`}
            >
              <img src={track.coverImage} alt={track.songName} className="w-12 h-12 rounded-md object-cover" />
              <div>
                <p className="font-semibold text-sm">{track.songName}</p>
                <p className="text-xs text-neutral-400">{track.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}