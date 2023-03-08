import mongoose from "mongoose";

const authorSchema = new mongoose.Schema(
  {
    /* id: {
      type: Number,
      required: true,
    }, */
    Firstname: String,
    Lastname: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Author", authorSchema);
