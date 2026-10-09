import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProjectDescription {
  desc: string[];
  features: string[];
  footer?: string;
}

export interface IProject extends Document {
  title: string;
  short_description: string;
  description: IProjectDescription;
  tech: string[];
  demo_url?: string;
  playstore_url?: string;
  github_url?: string;
  sort_key?: string;
  sort_order: number;
  is_featured: boolean;
  views: number;
  createdAt: Date;
  imageUrls?: string[];
  category?: string;
}

const ProjectSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    short_description: { type: String, required: true },
    description: {
      desc: [String],
      features: [String],
      footer: String
    },
    tech: [String],
    imageUrls: [String],
    demo_url: String,
    github_url: String,
    playstore_url: String,
    sort_key: String,
    sort_order: { type: Number, default: 0 },
    is_featured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    category: { type: String, default: "" }
  },
  {
    timestamps: true
  }
);

// Clear mongoose model cache for Project in development/hot-reload to apply schema updates instantly
if (mongoose.models.Project) {
  mongoose.deleteModel("Project");
}

const Project: Model<IProject> = mongoose.model<IProject>("Project", ProjectSchema);

export { Project };
export default Project;
