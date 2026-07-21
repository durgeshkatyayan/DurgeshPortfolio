import mongoose, { Schema, Document } from "mongoose";

export interface ISkill extends Document {
  name: string;
  icon: string; // SVG string or image URL
  percentage: number;
  category: "Frontend" | "Backend" | "Database" | "Mobile" | "DevOps" | "Programming" | "Tools";
  color: string; // Hex code for UI flair
  order: number;
}

const SkillSchema = new Schema<ISkill>({
  name: { type: String, required: true },
  icon: { type: String, required: true },
  percentage: { type: Number, required: true, min: 0, max: 100 },
  category: { 
    type: String, 
    required: true,
    enum: ["Frontend", "Backend", "Database", "Mobile", "DevOps", "Programming", "Tools"]
  },
  color: { type: String, default: "#3b82f6" }, // Default Tailwind Blue
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Skill || mongoose.model<ISkill>("Skill", SkillSchema);