var Mongoose = require("mongoose"),
  Schema = Mongoose.Schema;

var CommentSchema = new Schema(
  {
    tenant: { type: Mongoose.Schema.Types.ObjectId, ref: "Tenant" },
    rehearsal: { type: Boolean, default: false },
    //谁添加的讨论
    who: { type: String, required: true },
    //回复的是谁的评论
    towhom: { type: String, required: true },
    objtype: {
      //被评论对象的类型
      type: String,
      enum: ["SITE", "TENANT", "TEMPLATE", "WORKFLOW", "WORK", "TODO", "COMMENT"],
      default: "TENANT",
    },
    //被评论对象的ID
    objid: { type: String },
    //线索ID保持为业务对象的第一个评论的ID（objtype非COMMENT）
    threadid: { type: String },
    //评论中通过@uid方式所提到的uid
    people: { type: [String], default: [] },
    //评论的内容
    content: { type: String, default: "" },
    //评论的上下文信息
    context: {
      //评论在哪个工作流中
      wfid: String,
      //评论在哪个工作
      workid: String,
      //评论在哪个具体的TODO
      todoid: String,
    },
  },
  //createdAt, updatedAt 自动生成，用于排序
  { timestamps: true }
);

module.exports = Mongoose.model("Comment", CommentSchema);
