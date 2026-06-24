import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAdminOTP extends Document {
  email: string;
  otp_code: string;
  expires_at: Date;
  is_verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AdminOTPSchema: Schema = new Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    otp_code: { type: String, required: true },
    expires_at: { type: Date, required: true },
    is_verified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// TTL index to automatically remove expired OTP documents from the database
AdminOTPSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

if (mongoose.models.AdminOTP) {
  mongoose.deleteModel("AdminOTP");
}

const AdminOTP: Model<IAdminOTP> = mongoose.models.AdminOTP || mongoose.model<IAdminOTP>("AdminOTP", AdminOTPSchema);

export { AdminOTP };
export default AdminOTP;
