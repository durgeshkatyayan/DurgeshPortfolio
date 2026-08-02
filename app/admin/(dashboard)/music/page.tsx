"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { IMusic } from "@/models/Music";
import { 
  Trash2, 
  Music as MusicIcon, 
  Plus, 
  Loader2, 
  Upload, 
  FileAudio, 
  Image as ImageIcon,
  Pencil,
  X,
  Save,
  CheckCircle2
} from "lucide-react";

const CATEGORIES = ["Turkish", "Indian", "English", "Russian", "Bhojpuri", "Bhakti", "Other"];

export default function AdminMusicPage() {
  const [songs, setSongs] = useState<IMusic[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [category, setCategory] = useState("Indian");
  const [duration, setDuration] = useState("");

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [existingAudioUrl, setExistingAudioUrl] = useState<string>("");

  const fetchSongs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/music");
      const json = await res.json();
      if (json.success) setSongs(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || data.error || "File upload failed");
    }

    return data.url;
  };

  // Populate form for updating
  const handleStartEdit = (song: any) => {
    setEditingId(song._id);
    setTitle(song.songName || song.title || "");
    setArtist(song.artist || "");
    setCategory(song.genre || song.category || "Indian");
    setDuration(song.duration || "");
    setImagePreview(song.coverImage || "");
    setExistingAudioUrl(song.audioUrl || "");
    setAudioFile(null);
    setImageFile(null);
    
    // Smooth scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setArtist("");
    setCategory("Indian");
    setDuration("");
    setAudioFile(null);
    setImageFile(null);
    setImagePreview("");
    setExistingAudioUrl("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      alert("Please enter a Song Title.");
      return;
    }

    if (!editingId && (!audioFile || !imageFile)) {
      alert("Please upload both cover image and MP3 file for new songs.");
      return;
    }

    setSubmitting(true);
    try {
      // 1. Upload new files if provided; fallback to existing URLs if editing
      let coverImageUrl = imagePreview;
      if (imageFile) {
        coverImageUrl = await uploadFile(imageFile);
      }

      let audioUrl = existingAudioUrl;
      if (audioFile) {
        audioUrl = await uploadFile(audioFile);
      }

      // 2. Prepare payload
      const payload = {
        songName: title,
        artist: artist || "Unknown Artist",
        genre: category,
        duration: duration || "0:00",
        coverImage: coverImageUrl,
        audioUrl: audioUrl,
      };

      const url = editingId ? `/api/music/${editingId}` : "/api/music";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        resetForm();
        fetchSongs();
      } else {
        alert(data.message || data.error || "Failed to save track.");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "An error occurred during submission.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this track?")) return;

    try {
      const res = await fetch(`/api/music/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setSongs((prev) => prev.filter((song) => (song as any)._id !== id));
        if (editingId === id) resetForm();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto text-white space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <MusicIcon className="text-blue-400" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Music Library</h1>
            <p className="text-xs text-neutral-400">Manage, edit, and upload track collections</p>
          </div>
        </div>
        <span className="text-xs bg-neutral-900 border border-neutral-800 text-neutral-400 px-3 py-1.5 rounded-full font-mono">
          Total Tracks: {songs.length}
        </span>
      </div>

      {/* Main Upload / Update Form */}
      <form
        onSubmit={handleSubmit}
        className={`bg-neutral-900/60 backdrop-blur-xl border ${
          editingId ? "border-amber-500/30" : "border-neutral-800"
        } rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl transition-all duration-300`}
      >
        <div className="flex items-center justify-between border-b border-neutral-800/60 pb-4">
          <h2 className="text-lg font-semibold text-neutral-100 flex items-center gap-2">
            {editingId ? (
              <>
                <Pencil size={18} className="text-amber-400" /> Edit Track Meta & Assets
              </>
            ) : (
              <>
                <Plus size={18} className="text-blue-400" /> Upload New Song
              </>
            )}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"
            >
              <X size={14} /> Cancel Editing
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-medium text-neutral-300 mb-1.5 block">Song Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Pasoori / Tere Vaaste"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-neutral-950/80 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-300 mb-1.5 block">Artist Name</label>
            <input
              type="text"
              placeholder="e.g. Arijit Singh"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="w-full bg-neutral-950/80 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-300 mb-1.5 block">Genre / Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-neutral-950/80 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-blue-500 transition"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-300 mb-1.5 block">Duration (optional)</label>
            <input
              type="text"
              placeholder="e.g. 3:45"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-neutral-950/80 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>
        </div>

        {/* Upload Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Cover Image Upload */}
          <div>
            <label className="text-xs text-neutral-300 mb-2 block font-medium">
              {editingId ? "Update Cover Image (Optional)" : "Cover Image *"}
            </label>
            <div className="flex items-center gap-4">
              <label className="flex-1 flex flex-col items-center justify-center h-32 border-2 border-dashed border-neutral-800 hover:border-blue-500/60 rounded-2xl cursor-pointer bg-neutral-950/50 hover:bg-neutral-950 transition group">
                <ImageIcon size={26} className="text-neutral-500 group-hover:text-blue-400 mb-1.5 transition" />
                <span className="text-xs text-neutral-400 px-2 text-center truncate max-w-[200px]">
                  {imageFile ? imageFile.name : "Select Image File"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {imagePreview && (
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-neutral-700/80 shrink-0 shadow-md">
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Audio Upload */}
          <div>
            <label className="text-xs text-neutral-300 mb-2 block font-medium">
              {editingId ? "Update MP3 File (Optional)" : "MP3 Track *"}
            </label>
            <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-neutral-800 hover:border-blue-500/60 rounded-2xl cursor-pointer bg-neutral-950/50 hover:bg-neutral-950 transition group">
              <FileAudio size={26} className="text-neutral-500 group-hover:text-blue-400 mb-1.5 transition" />
              <span className="text-xs text-neutral-400 px-2 text-center truncate max-w-[220px]">
                {audioFile
                  ? audioFile.name
                  : existingAudioUrl
                  ? "Existing MP3 Attached (Click to replace)"
                  : "Select MP3 Track"}
              </span>
              <input
                type="file"
                accept="audio/mp3,audio/*"
                onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className={`flex-1 ${
              editingId
                ? "bg-amber-600 hover:bg-amber-500"
                : "bg-blue-600 hover:bg-blue-500"
            } text-white font-medium py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 text-sm`}
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {editingId ? "Updating Track..." : "Uploading Files..."}
              </>
            ) : editingId ? (
              <>
                <Save size={18} /> Update Song Details
              </>
            ) : (
              <>
                <Upload size={18} /> Save & Publish Track
              </>
            )}
          </button>
        </div>
      </form>

      {/* Song List View */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-neutral-200">Track Catalog ({songs.length})</h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-blue-500" size={32} />
          </div>
        ) : songs.length === 0 ? (
          <div className="p-12 text-center text-neutral-500 bg-neutral-900/40 rounded-3xl border border-neutral-800/60">
            No tracks found in database.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {songs.map((song: any) => {
              const isCurrentlyEditing = editingId === song._id;
              const displayTitle = song.songName || song.title || "Untitled";
              const displayGenre = song.genre || song.category || "Uncategorized";

              return (
                <div
                  key={song._id}
                  className={`flex items-center gap-4 bg-neutral-900/50 border ${
                    isCurrentlyEditing ? "border-amber-500/50 bg-amber-500/5" : "border-neutral-800/80"
                  } p-3.5 rounded-2xl justify-between transition hover:border-neutral-700/80`}
                >
                  <div className="flex items-center gap-3.5 overflow-hidden">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-neutral-950 shrink-0 border border-neutral-800">
                      <Image
                        src={song.coverImage || "/placeholder.png"}
                        alt={displayTitle}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-medium text-neutral-200 truncate text-sm">
                        {displayTitle}
                      </h3>
                      <p className="text-xs text-neutral-400 truncate mt-0.5">
                        {song.artist || "Unknown Artist"}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="inline-block bg-blue-500/10 text-blue-400 text-[10px] px-2.5 py-0.5 rounded-full border border-blue-500/20 font-medium">
                          {displayGenre}
                        </span>
                        {song.duration && (
                          <span className="text-[10px] text-neutral-500 font-mono">
                            {song.duration}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleStartEdit(song)}
                      className={`p-2 ${
                        isCurrentlyEditing
                          ? "text-amber-400 bg-amber-400/10"
                          : "text-neutral-400 hover:text-amber-400 hover:bg-neutral-800/80"
                      } rounded-xl transition`}
                      title="Edit Track"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(song._id)}
                      className="p-2 text-neutral-400 hover:text-red-400 hover:bg-neutral-800/80 rounded-xl transition"
                      title="Delete Track"
                    >
                      <Trash2 size={16} />
                    </button>
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