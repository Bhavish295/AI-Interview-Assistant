import mongoose, { Schema, type InferSchemaType } from "mongoose";
import { TRACKS, DIFFICULTIES } from "@/lib/tracks";

export { TRACKS, DIFFICULTIES };

const QuestionSchema = new Schema(
  {
    track: { type: String, required: true, enum: [...TRACKS] },
    difficulty: { type: String, required: true, enum: [...DIFFICULTIES] },
    question: { type: String, required: true },
    keywords: { type: [String], default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

QuestionSchema.index({ track: 1, difficulty: 1 });

export type Question = InferSchemaType<typeof QuestionSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const QuestionModel =
  (mongoose.models.Question as mongoose.Model<Question>) || mongoose.model<Question>("Question", QuestionSchema);

export default QuestionModel;
