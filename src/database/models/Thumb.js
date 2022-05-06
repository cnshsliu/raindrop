var Mongoose = require("mongoose"),
  Schema = Mongoose.Schema;

var ThumbSchema = new Schema(
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
);

module.exports = Mongoose.model("Thumb", ThumbSchema);
