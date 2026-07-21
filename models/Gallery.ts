import mongoose, { Schema, Document } from "mongoose";

export interface IGallery extends Document {
  title: string;
  mediaUrl: string; // Cloudinary URL
  mediaType: "image" | "video";
  album: string;
  isFeatured: boolean;
}

const GallerySchema = new Schema<IGallery>(
  {
    title: { type: String, required: true },
    mediaUrl: { type: String, required: true },
    mediaType: { type: String, enum: ["image", "video"], default: "image" },
    album: { type: String, default: "General" },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Gallery || mongoose.model<IGallery>("Gallery", GallerySchema);