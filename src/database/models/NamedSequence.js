"use strict";
const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const NamedSequenceSchema = new Schema({
  sequence_name: { type: String, unique: true },
  sequence_value: { type: Number },
});

NamedSequenceSchema.statics.getNextSequenceValue = async function (sequenceName) {
  let sequenceDocument = await this.db.models["NamedSequence"].findOneAndUpdate(
    { sequence_name: sequenceName },
    { $inc: { sequence_value: 1 } },
    { upsert: true, new: true }
  );
  return sequenceDocument.sequence_value;
};

var counter = Mongoose.model("NamedSequence", NamedSequenceSchema);

module.exports = counter;
