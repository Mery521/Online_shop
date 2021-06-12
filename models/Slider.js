const mongoose = require("mongoose");
const Schema = mongoose.Schema;


let SlideSchema = new Schema(
  {
    name: {
       type: String
    },
    image: {
       type: String
    },
    content: {
       type: String
    },
    contentPosition: {
        type: String
   },
  },
);
const SliderSchema = new Schema(
  {
    title: {
        type: String
    },
    slides: [SlideSchema],
   
  }
);

const Slide = mongoose.model("Slide", SlideSchema);
const Slider = mongoose.model("Slider", SliderSchema);

module.exports = { Slide, Slider };
