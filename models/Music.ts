import mongoose, { Schema, Document } from "mongoose";

export interface IMusic extends Document {
  songName: string;
  artist: string;
  coverImage: string;
  audioUrl: string; // Cloudinary URL
  genre: string;
  playlist: string;
}

const MusicSchema = new Schema<IMusic>({
  songName: { type: String, required: true },
  artist: { type: String, required: true },
  coverImage: { type: String, required: true },
  audioUrl: { type: String, required: true },
  genre: { type: String, required: true },
  playlist: { type: String, default: "Singles" }
}, { timestamps: true });

export default mongoose.models.Music || mongoose.model<IMusic>("Music", MusicSchema);