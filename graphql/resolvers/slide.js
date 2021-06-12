const { Slider } = require("../../models/Slider");
const dotenv = require("dotenv");
const { UserInputError } = require("apollo-server-errors");
dotenv.config();

module.exports = {
    Query: {
        slider: async (_, { id }) => {
            return await Slider.findOne({ id: id })
        },
        adminSlider: async (_, { id }) => {
            return await Slider.findOne({ id: id })
        },
        adminSliders: async () => {
            const res = await Slider.find();
            return res;
        },    
    },    
    Mutation: {
        adminAddSlider: async (_,{title, image, name,}) => {
           const addedSlider = [];
                if (Slider.slides) {
                    addedSlider = Slider.slides.find(element => {
                        return element.image == image;
                    });
                }
                if (!addedSlider) {
                    Slider.slides.push({
                        imag: image,
                        name: name
                    });
                }
            const slider = await  new Slider({
       
                title: title,
                slides: [
                    {
                        image: image,
                        name: name
                    }
                  ],      
            }) 
            return await  slider.save();
        },
        adminUpdateSlider: async(_, args) => { //it dose not work correct
            const { sliderId, title, image, name } = args
            try{
                const newSlider = await Slider.findOneAndUpdate({
                    id: sliderId,
                    title: title,
                    slides: [
                        {
                            image: image,
                            name: name,
                        }
                      ],   
                    useFindAndModify: false
                })
                return newSlider
            }
            catch(err) {
                console.log(err);
            }
        },
        adminDeleteSlide: async (_, { slideId, id }) => {
            //if (!user) throw new AuthenticationError("Unauthenticated");
            return await Slider.updateOne(
              {id: id },
              { $pull: {slides: { _id: slideId } } }
            )
          }, 
        // adminMassDeleteSlides: async (_, { slideIds, id}) => {
        //     return await Slider.updateOne(
        //         { id: id },
        //         // $pull removes from array all instances!
        //         { $pull: {slides: { id: [...slideIds] } } }
        //       )
        // },   
        adminDeleteSlider: async (_, { sliderId }) => {
            let oneSlider = await Slider.findOneAndRemove(
              { id: sliderId },
              { useFindAndModify: false },
            );
            return await oneSlider;
        },
        adminMassDeleteSliders: async(_, { sliderIds }, {user}) => {
            return await Slider.deleteMany({
              id: {
                $in: [...sliderIds],
              },
            });
        }
    }
}
