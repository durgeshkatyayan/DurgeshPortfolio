import mongoose, { Schema, type HydratedDocument, type InferSchemaType, type Model } from "mongoose";

const CertificateSchema = new Schema(
  {
    title: { type: String, required: true },
    organization: { type: String, required: true },
    certificateImage: { type: String, required: true },
    url: { type: String },
    issueDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export type CertificateDocument = HydratedDocument<InferSchemaType<typeof CertificateSchema>>;
export type CertificateModel = Model<CertificateDocument>;

const Certificate = (mongoose.models.Certificate as CertificateModel) || mongoose.model<CertificateDocument>("Certificate", CertificateSchema);

export default Certificate;