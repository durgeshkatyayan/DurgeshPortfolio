import mongoose, { Schema, Document } from "mongoose";

export interface ISettings extends Document {
  siteName: string;
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  keywords: string[];
  siteUrl: string;
  openGraphImage?: string;
  twitterHandle?: string;
}

const SettingsSchema = new Schema<ISettings>(
  {
    siteName: { 
      type: String, 
      required: true, 
      default: "My Portfolio" 
    },
    defaultMetaTitle: { 
      type: String, 
      required: true 
    },
    defaultMetaDescription: { 
      type: String, 
      required: true 
    },
    keywords: [{ 
      type: String 
    }],
    siteUrl: { 
      type: String, 
      required: true 
    },
    openGraphImage: { 
      type: String 
    },
    twitterHandle: { 
      type: String 
    },
  },
  { timestamps: true }
);

// Prevent Next.js HMR (Hot Module Replacement) from redefining the model during development
export default mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);