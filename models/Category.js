const { Schema, model } = require("mongoose");

const categorySchema = new Schema(
  {
    title: {
      type: String,
      default: ""
    },
    parent: {
      type: String,
      default: ""
    },
  },
  { timestamps: true }
);

module.exports = model("Category", categorySchema);
