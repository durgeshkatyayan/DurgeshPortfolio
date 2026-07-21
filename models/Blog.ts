import mongoose, { Schema, type HydratedDocument, type InferSchemaType, type Model } from "mongoose";

const BlogSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  coverImage: { type: String, required: true },
  isPublished: { type: Boolean, default: false },
  metaTitle: { type: String },
  metaDescription: { type: String },
}, { timestamps: true });

export type BlogDocument = HydratedDocument<InferSchemaType<typeof BlogSchema>>;
export type BlogModel = Model<BlogDocument>;

const Blog = (mongoose.models.Blog as BlogModel) || mongoose.model<BlogDocument>("Blog", BlogSchema);

export default Blog;