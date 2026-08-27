import mongoose, { Schema, type InferSchemaType } from "mongoose";

const AnswerSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, default: "" },
    score: { type: Number, default: 0 },
    technicalAccuracy: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    confidence: { type: Number, default: 0 },
    strengths: { type: [String], default: [] },
    weaknesses: { type: [String], default: [] },
    improvementTips: { type: [String], default: [] },
  },
  { _id: false }
);

const ResultSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    track: { type: String, default: "General" },
    difficulty: { type: String, default: "Mixed" },
    answers: { type: [AnswerSchema], default: [] },
    overallScore: { type: Number, default: 0 },
    resumeInsight: { type: String, default: "" },
  },
  { timestamps: true }
);

export type Result = InferSchemaType<typeof ResultSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const ResultModel = (mongoose.models.Result as mongoose.Model<Result>) || mongoose.model<Result>("Result", ResultSchema);

export default ResultModel;
