import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMusic extends Document {
  title: string;
  artist: string;
  genre: "Turkish" | "Indian" | "English" | "Russian" | "Bhojpuri" | "Bhakti" | "Other";
  audioUrl: string;
  coverImage: string;
  duration?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const MusicSchema: Schema<IMusic> = new Schema(
  {
    title: { type: String, required: true },
    artist: { type: String, required: true, default: "Unknown Artist" },
    genre: {
      type: String,
      required: true,
      enum: ["Turkish", "Indian", "English", "Russian", "Bhojpuri", "Bhakti", "Other"],
      default: "Indian",
    },
    audioUrl: { type: String, required: true },
    coverImage: { type: String, required: true },
    duration: { type: String },
  },
  { timestamps: true }
);

const Music: Model<IMusic> =
  mongoose.models.Music || mongoose.model<IMusic>("Music", MusicSchema);

export default Music;