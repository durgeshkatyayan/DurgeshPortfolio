import mongoose, { Schema, model, models } from "mongoose";

export interface IProfile {
  photo: string;
  fullName: string;
  tagline: string;
  typingDesignations: string[];
  email: string;
  phone?: string;
  dob?: string;
  location: string;
  nationality?: string;
  experienceYears?: string;
  currentCompany?: string;
  resumeUrl?: string;

  availabilityStatus:
    | "Available"
    | "Not Available"
    | "Freelance Only";

  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    facebook?: string;
    portfolio?: string;
  };
}

const ProfileSchema = new Schema<IProfile>(
  {
    photo: { type: String, required: true },
    fullName: { type: String, required: true },
    tagline: { type: String, required: true },
    typingDesignations: [{ type: String }],

    email: { type: String, required: true },
    phone: String,
    dob: String,

    location: { type: String, required: true },
    nationality: String,
    experienceYears: String,
    currentCompany: String,
    resumeUrl: String,

    availabilityStatus: {
      type: String,
      enum: ["Available", "Not Available", "Freelance Only"],
      default: "Available",
    },

    socialLinks: {
      github: String,
      linkedin: String,
      
      portfolio: String,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Profile || model<IProfile>("Profile", ProfileSchema);