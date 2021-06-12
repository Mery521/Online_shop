const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CustomerAddressSchema = Schema({
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  country: {
    type: String,
  },
});


module.exports = {
  CustomerAddressSchema,
};
