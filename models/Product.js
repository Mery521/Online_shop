const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    title: {
      type: String,
      require: true
    },
    image: {
      type: String,
    },
    brand: {
      type: String,
      require: [true, "brand required"],
    },
    description: {
      type: String,
      require: [true, "description required"],
    },
    price: {
      type: Number,
      require: [true, "price required"],
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("Product", productSchema);
