import mongoose, { Schema, Document } from "mongoose";

export interface IMeetup extends Document {
  event: string;
  date: Date;
  location: string;
  description: string;
  photos: string[]; // Array of Cloudinary URLs
}

const MeetupSchema = new Schema<IMeetup>(
  {
    event: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    photos: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Meetup || mongoose.model<IMeetup>("Meetup", MeetupSchema);