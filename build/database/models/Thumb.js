"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
exports.default = mongoose_1.default.model("Thumb", new mongoose_1.default.Schema({
    tenant: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Tenant" },
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
}, { timestamps: true }));
//# sourceMappingURL=Thumb.js.map