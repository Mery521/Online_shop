const { Schema, model } = require("mongoose");

const reviewSchema = new Schema(
  {
    customer_id: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      require: [true, "customer_id required"],
    },
    product_id: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      require: [true, "product_id required"],
    },
    review: {
      type: String,
      required: [true, "review required"],
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    name: String,
    title: String,
  },
  { timestamps: true }
);

module.exports = model("Review", reviewSchema);
