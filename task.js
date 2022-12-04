import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    task: {
      type: String,
      default: "New task",
    },
    autor: {
      type: String,
      requred: true,
    },
    id: {
      type: Number,
      requred: true,
    },
    //if not requred, i send like String, not like Object. exm:     Id: string
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Task", TaskSchema);
