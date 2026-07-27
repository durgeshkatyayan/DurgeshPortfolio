"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { Save, Music, Plus, Pencil, Trash2, Loader2, X } from "lucide-react";
import Loader from "@/components/ui/Loader";

interface MusicForm {
  _id?: string;
  title: string;
  artist: string;
  spotifyUrl: string;
  order: number;
}

export default function AdminMusicPage() {
  const { register, handleSubmit, reset } = useForm<MusicForm>({ defaultValues: { order: 0 } });
  const [tracks, setTracks] = useState<MusicForm[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchMusic = async () => {
    try {
      const { data } = await axios.get("/api/music");
      setTracks(data);
    } catch (error) { toast.error("Failed to load music"); } 
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchMusic(); }, []);

  const onSubmit = async (data: MusicForm) => {
    setIsSubmitting(true);
    try {
      if (editingId) {
        await axios.put("/api/music", { ...data, _id: editingId });
        toast.success("Track updated!");
      } else {
        await axios.post("/api/music", data);
        toast.success("Track added!");
      }
      reset({ title: "", artist: "", spotifyUrl: "", order: 0 });
      setEditingId(null);
      fetchMusic();
    } catch (error) { toast.error("Failed to save"); } 
    finally { setIsSubmitting(false); }
  };

  const handleEdit = (track: MusicForm) => {
    setEditingId(track._id as string);
    reset(track);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this track?")) return;
    try {
      await axios.delete(`/api/music?id=${id}`);
      toast.success("Removed successfully!");
      fetchMusic();
    } catch (error) { toast.error("Failed to remove"); }
  };

  if (isLoading) return <div className="flex min-h-[70vh] items-center justify-center"><Loader /></div>;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white">Music / Playlist</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl border bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sticky top-24 space-y-4">
            <h2 className="flex justify-between font-bold text-lg dark:text-white mb-2">
              <span className="flex items-center gap-2"><Music className="text-purple-500"/> {editingId ? "Edit" : "Add"} Track</span>
              {editingId && <button type="button" onClick={() => { setEditingId(null); reset(); }}><X size={20}/></button>}
            </h2>
            
            <input {...register("title", { required: true })} placeholder="Track Title" className="w-full rounded-xl border p-3 dark:bg-transparent dark:border-neutral-700 outline-none focus:border-purple-500" />
            <input {...register("artist", { required: true })} placeholder="Artist" className="w-full rounded-xl border p-3 dark:bg-transparent dark:border-neutral-700 outline-none focus:border-purple-500" />
            <input type="url" {...register("spotifyUrl", { required: true })} placeholder="Spotify URL" className="w-full rounded-xl border p-3 dark:bg-transparent dark:border-neutral-700 outline-none focus:border-purple-500" />
            <input type="number" {...register("order")} placeholder="Sort Order" className="w-full rounded-xl border p-3 dark:bg-transparent dark:border-neutral-700 outline-none focus:border-purple-500" />

            <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-purple-600 p-3.5 font-bold text-white transition hover:bg-purple-700 flex justify-center gap-2">
              {isSubmitting ? <Loader2 className="animate-spin" /> : (editingId ? <Save /> : <Plus />)} Save Track
            </button>
          </form>
        </div>

        <div className="lg:col-span-7 space-y-4">
          {tracks.map((track) => (
            <div key={track._id} className="flex items-center justify-between rounded-2xl border bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm">
              <div>
                <h4 className="font-bold dark:text-white">{track.title}</h4>
                <p className="text-sm text-neutral-500">{track.artist}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(track)} className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-neutral-500 hover:text-purple-500"><Pencil size={16}/></button>
                <button onClick={() => handleDelete(track._id!)} className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-neutral-500 hover:text-red-500"><Trash2 size={16}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}