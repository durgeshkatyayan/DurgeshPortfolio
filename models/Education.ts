import mongoose, { Schema, type HydratedDocument, type InferSchemaType, type Model } from "mongoose";

const EducationSchema = new Schema(
  {
    degree: { type: String, required: true },
    college: { type: String, required: true },
    university: { type: String },
    year: { type: String, required: true },
    grade: { type: String },
    description: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type EducationDocument = HydratedDocument<InferSchemaType<typeof EducationSchema>>;
export type EducationModel = Model<EducationDocument>;

const Education = (mongoose.models.Education as EducationModel) || mongoose.model<EducationDocument>("Education", EducationSchema);

export default Education;