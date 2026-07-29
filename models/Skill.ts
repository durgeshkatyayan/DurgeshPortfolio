import mongoose, { Schema, Document } from "mongoose";

export interface ISkill extends Document {
  name: string;
  icon: string;
  percentage: number;
  category: string;
  color: string;
  order: number;
}

const SkillSchema = new Schema<ISkill>({
  name: { 
    type: String, 
    required: [true, "Skill name is required"],
    unique: true,
    trim: true
  },
  icon: { 
    type: String, 
    required: [true, "Icon/SVG is required"],
    trim: true
  },
  percentage: { 
    type: Number, 
    required: [true, "Percentage is required"],
    min: [0, "Percentage must be at least 0"],
    max: [100, "Percentage cannot exceed 100"]
  },
  category: { 
    type: String, 
    required: [true, "Category is required"]
    // REMOVE the enum entirely - this is the key fix!
  },
  color: { 
    type: String, 
    default: "#3b82f6" 
  },
  order: { 
    type: Number, 
    default: 0 
  }
}, { 
  timestamps: true 
});

// Create indexes for better performance
SkillSchema.index({ category: 1, order: 1 });

// Clear the cached model to ensure the new schema is used
// This is critical for Next.js hot reloading
delete mongoose.models.Skill;

const Skill = mongoose.model<ISkill>("Skill", SkillSchema);

export default Skill;