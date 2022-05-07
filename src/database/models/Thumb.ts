import Mongoose from "mongoose";

export default Mongoose.model(
  "Thumb",

  new Mongoose.Schema(
    {
      tenant: { type: Mongoose.Schema.Types.ObjectId, ref: "Tenant" },
      //Which 对哪个评论
      cmtid: { type: String, required: true },
      //Who 谁
      who: { type: String, required: true },
      //What
      upordown: {
        type: String,
        enum: ["UP", "DOWN"],
        default: "UP",
      },
    },
    { timestamps: true }
  )
);
