import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    task: {
      type: String,
      default: "New task",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      requred: true,
    },
    description: String,
    id: Number
    //if not requred, i send like String, not like Object. exm:     Id: string
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Task", TaskSchema);
