import mongoose, { Schema, Document } from "mongoose";

export interface ICertificate extends Document {
  title: string;
  organization: string;
  certificateImage: string;
  url?: string;
  issueDate: Date;
}

const CertificateSchema = new Schema<ICertificate>(
  {
    title: { type: String, required: true },
    organization: { type: String, required: true },
    certificateImage: { type: String, required: true },
    url: { type: String },
    issueDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Certificate || mongoose.model<ICertificate>("Certificate", CertificateSchema);