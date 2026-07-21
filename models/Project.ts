import mongoose, { Schema, type HydratedDocument, type InferSchemaType, type Model } from "mongoose";

const ProjectSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },
    images: [{ type: String }],
    techStack: [{ type: String }],
    githubUrl: { type: String },
    liveUrl: { type: String },
    category: { type: String, required: true },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ["completed", "in-progress"], default: "completed" }
}, { timestamps: true });

export type ProjectDocument = HydratedDocument<InferSchemaType<typeof ProjectSchema>>;
export type ProjectModel = Model<ProjectDocument>;

const Project =
  (mongoose.models.Project as ProjectModel) ||
  mongoose.model<ProjectDocument>("Project", ProjectSchema);

export default Project;