import mongoose, { Schema, Document } from "mongoose";

export interface IStatistic extends Document {
  label: string;
  value: number;
  suffix?: string; // e.g., "+", "%", "k"
  icon?: string;
  order: number;
}

const StatisticSchema = new Schema<IStatistic>(
  {
    label: { type: String, required: true },
    value: { type: Number, required: true },
    suffix: { type: String, default: "" },
    icon: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Statistic || mongoose.model<IStatistic>("Statistic", StatisticSchema);