"use strict";
const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const UserSchema = new Schema({
  //当前MTC部署的SITE编号
  site: String,
  //租户
  tenant: { type: Mongoose.Schema.Types.ObjectId, ref: "Tenant" },
  //用户名
  username: { type: String, unique: false, required: true },
  //用户密码
  password: { type: String, unique: false, required: true },
  //用户邮箱
  email: { type: String, trim: true, lowercase: true, unique: true, required: true },
  //用户邮箱是否已经验证
  emailVerified: { type: Boolean, default: false },
  //用户是否配置了 通知
  ew: { email: { type: Boolean, default: true }, wecom: { type: Boolean, default: false } }, //Send email on new work
  ps: { type: Number, default: 20 }, // Page size
  config: {
    keepinput: { type: Boolean, defalt: false },
    keeptemp: { type: Boolean, defalt: true },
  },
  //用户所属用户组
  group: {
    type: String,
    enum: ["DOER", "OBSERVER", "ADMIN", "SALES", "BD", "BA", "CS", "LEADER", "NOQUOTA", "NONE"],
    default: "ADMIN",
  },
  //Avatar
  avatar: { type: Mongoose.Schema.Types.String },
  avatarinfo: { path: String, media: String },
  //签名档URL
  signature: { type: String, default: "" },
});

module.exports = Mongoose.model("User", UserSchema);
