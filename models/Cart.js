const {Schema} = require("mongoose");
const mongoose = require("mongoose");

const CartItemSchema = new Schema(
  {
    product_id: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      require: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  }
);

const CartSchema = new Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    items: [CartItemSchema],
    
    status: {
      default: 0,
      type: Number,
    },
    total: {
      type: Number,
    },
  },
);

const Item = mongoose.model("Item", CartItemSchema);
const Cart = mongoose.model("Cart", CartSchema);
module.exports = { Item, Cart };
