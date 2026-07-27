import mongoose, { Schema, type HydratedDocument, type InferSchemaType, type Model } from "mongoose";

const EducationSchema = new Schema(
  {
    degree: { type: String, required: true },
    college: { type: String, required: true },
    university: { type: String },
    location: { type: String }, // NEW: Location field
    logo: { type: String }, // NEW: Logo upload URL
    year: { type: String, required: true },
    grade: { type: String },
    description: { type: String },
    achievements: { type: String }, // NEW: Extra section field
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type EducationDocument = HydratedDocument<InferSchemaType<typeof EducationSchema>>;
export type EducationModel = Model<EducationDocument>;

const Education = (mongoose.models.Education as EducationModel) || mongoose.model<EducationDocument>("Education", EducationSchema);

export default Education;