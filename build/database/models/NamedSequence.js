"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const NamedSequenceSchema = new mongoose_1.default.Schema({
    sequence_name: { type: String, unique: true },
    sequence_value: { type: Number },
});
NamedSequenceSchema.statics.getNextSequenceValue = function (sequenceName) {
    return __awaiter(this, void 0, void 0, function* () {
        let sequenceDocument = yield this.db.models["NamedSequence"].findOneAndUpdate({ sequence_name: sequenceName }, { $inc: { sequence_value: 1 } }, { upsert: true, new: true });
        return sequenceDocument.sequence_value;
    });
};
var counter = mongoose_1.default.model("NamedSequence", NamedSequenceSchema);
exports.default = counter;
//# sourceMappingURL=NamedSequence.js.map