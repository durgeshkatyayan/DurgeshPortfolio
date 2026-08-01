import mongoose, { Schema, Document } from "mongoose";

export interface IExperience extends Document {
  company: string;
  logo?: string;
  position: string;
  description: string;
  responsibilities?: string[];
  achievements?: string[];
  technologies: string[];
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  
  // Newly Added Essential Fields
  employmentType: 
    | "Full-time" 
    | "Part-time" 
    | "Contract" 
    | "Internship" 
    | "Freelance" 
    | "Training";
  workMode: "Remote" | "Hybrid" | "On-site";
  location?: string;
  companyUrl?: string;

  order: number;
}

const ExperienceSchema = new Schema<IExperience>(
  {
    company: { type: String, required: true },
    logo: { type: String },
    position: { type: String, required: true },
    description: { type: String, required: true },
    responsibilities: [{ type: String }],
    achievements: [{ type: String }],
    technologies: [{ type: String }],
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    isCurrent: { type: Boolean, default: false },

    // Employment Type
    employmentType: {
      type: String,
      enum: [
        "Full-time",
        "Part-time",
        "Contract",
        "Internship",
        "Freelance",
        "Training",
      ],
      default: "Full-time",
      required: true,
    },

    // Work Mode
    workMode: {
      type: String,
      enum: ["Remote", "Hybrid", "On-site"],
      default: "On-site",
      required: true,
    },

    // Job Location
    location: { type: String, default: "" }, // e.g. "Lucknow, India" or "Noida, India"

    // Company Web Link
    companyUrl: { type: String },

    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Experience ||
  mongoose.model<IExperience>("Experience", ExperienceSchema);