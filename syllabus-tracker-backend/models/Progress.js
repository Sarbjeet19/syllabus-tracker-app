// models/Progress.js (ESM)
import mongoose from "mongoose";

const TopicSchema = new mongoose.Schema({
  name: String,
  done: { type: Boolean, default: false }
});

const SubjectSchema = new mongoose.Schema({
  name: String,
  topics: [TopicSchema]
});

const ProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  subjects: { type: [SubjectSchema], default: [] }
}, { timestamps: true });

export default mongoose.model("Progress", ProgressSchema);
