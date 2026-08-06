import mongoose, { Schema, type HydratedDocument, type InferSchemaType, type Model } from "mongoose";

const AnalyticsSchema = new Schema(
  {
    visitorId: { type: String, required: true }, // To track returning users
    pageViewId: { type: String, required: true }, // Unique ID per page visit
    path: { type: String, required: true },
    referrer: { type: String },
    
    // ua-parser-js data
    browser: { type: String },
    os: { type: String },
    device: { type: String },
    
    // Behavior data
    duration: { type: Number, default: 0 }, // Time spent on page in seconds
    scrollDepth: { type: Number, default: 0 }, // Max scroll percentage (0-100)
    clicks: [{ type: String }], // Array of clicked element tags/classes
    isBounce: { type: Boolean, default: true }, // True if they leave quickly with no interaction
  },
  { timestamps: true }
);

export type AnalyticsDocument = HydratedDocument<InferSchemaType<typeof AnalyticsSchema>>;
export type AnalyticsModel = Model<AnalyticsDocument>;

const Analytics = (mongoose.models.Analytics as AnalyticsModel) || mongoose.model<AnalyticsDocument>("Analytics", AnalyticsSchema);

export default Analytics;