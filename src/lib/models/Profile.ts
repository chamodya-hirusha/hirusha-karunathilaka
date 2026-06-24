import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProfile extends Document {
  aboutTitle: string;
  storyParagraphs: string[];
  experienceYears: number;
  projectsCount: number;
  clientsCount: number;
  cvUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  whatsappUrl?: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema: Schema = new Schema(
  {
    aboutTitle: { type: String, default: "Full-Stack Developer" },
    storyParagraphs: { type: [String], default: [] },
    experienceYears: { type: Number, default: 1 },
    projectsCount: { type: Number, default: 15 },
    clientsCount: { type: Number, default: 5 },
    cvUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    linkedinUrl: { type: String, default: "" },
    whatsappUrl: { type: String, default: "" },
    email: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

// Clear mongoose model cache for Profile in development/hot-reload to apply schema updates instantly
if (mongoose.models.Profile) {
  mongoose.deleteModel("Profile");
}

const Profile: Model<IProfile> = mongoose.models.Profile || mongoose.model<IProfile>("Profile", ProfileSchema);

export { Profile };
export default Profile;
