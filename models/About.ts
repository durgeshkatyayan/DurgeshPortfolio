import mongoose, { Schema, type HydratedDocument, type InferSchemaType, type Model } from "mongoose";

const AboutSchema = new Schema({
  biography: { type: String, required: true },
  description: { type: String, required: true },
  interests: [{ type: String }],
  languages: [{ type: String }],
  resumeUrl: { type: String },
}, { timestamps: true });

export type AboutDocument = HydratedDocument<InferSchemaType<typeof AboutSchema>>;
export type AboutModel = Model<AboutDocument>;

const About = (mongoose.models.About as AboutModel) || mongoose.model<AboutDocument>("About", AboutSchema);

export default About;