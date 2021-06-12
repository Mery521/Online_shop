const { Schema, model } = require("mongoose");
const { isEmail } = require("validator");

const adminSchema = new Schema(
  {
    firstname: {
      type: String,
      require: [true, "firstname required"],
    },
    lastname: {
      type: String,
      require: [true, "lastname required"],
    },
    email: {
      type: String,
      require: [true, "email required"],
      unique: true,
      validate: {
        validator: isEmail,
        message: "Please fill a valid email address",
      },
    },
    password: {
      type: String,
      require: [true, "password required"],
    },
  },
  { timestamps: true }
);

module.exports = model("Admin", adminSchema);
