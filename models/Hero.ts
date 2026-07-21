import mongoose, { Schema, type HydratedDocument, type InferSchemaType, type Model } from "mongoose";

const HeroSchema = new Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  photo: { type: String, required: true },
  resumeUrl: { type: String },
  backgroundImage: { type: String },
  typingText: [{ type: String }],
  socialLinks: {
    github: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
  }
}, { timestamps: true });

export type HeroDocument = HydratedDocument<InferSchemaType<typeof HeroSchema>>;
export type HeroModel = Model<HeroDocument>;

const Hero = (mongoose.models.Hero as HeroModel) || mongoose.model<HeroDocument>("Hero", HeroSchema);

export default Hero;