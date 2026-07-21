import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  date: string;
  time: string;
  purpose: string;
  status: "pending" | "accepted" | "rejected" | "completed" | "cancelled";
}

const BookingSchema = new Schema<IBooking>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  company: { type: String },
  date: { type: String, required: true },
  time: { type: String, required: true },
  purpose: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["pending", "accepted", "rejected", "completed", "cancelled"], 
    default: "pending" 
  },
}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);