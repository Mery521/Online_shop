const { Cart } = require("../../models/Cart");
const Product = require("../../models/Product")
const mongoose = require("mongoose")
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  Query: {
    oneCart: async (_, args) => {
      try {
        let cart = await Cart.findOne({_id: args.id})
        if (!cart) throw new UserInputError("cart isn't found");
        return await cart;
      } 
      catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Mutation: {
    addProductInCart: async(_,{  customer_id, product_id, quantity }) =>{
      //if (!user) throw new AuthenticationError("Unauthenticated");
      try {
        let total = 0;
        let cart = await Cart.findOne( {
          customer_id: mongoose.Types.ObjectId(customer_id),
          status: 0
        });
        let product = await Product.findOne({_id: product_id}, 
          function(err, item) {
            return item;
        })
        if(cart){
           // if item is not in cart
          let addedProduct = [];
          if (cart.items) {
              addedProduct = cart.items.find(element => {
              return element.product_id == product_id;
            });
          }
          if (!addedProduct) {
            cart.items.push({
              product_id: product_id,
              quantity: quantity,
              price: product.price
            });
            //update total
            total = quantity * product.price;
            await Cart.updateOne(
              { _id : cart._id },
              { $set : { "total": total }}
            )
          }else {
            // if item in cart
            let quantity = addedProduct.quantity + 1;
            total = quantity * addedProduct.price;
            await Cart.updateOne(
              { _id : cart._id, "items.product_id":  product_id },
              { $set : { "items.$.quantity" : quantity, "total": total }}
            )
          } 
        } else {
          // if user haven't cart
          total = product.price * quantity;
          cart = await Cart({
            customer_id: customer_id,
            items: [
              {
                product_id: product_id,
                quantity: quantity,
                price: product.price
              }
            ],
            total: total
          })
        }
       return await cart.save()
      } 
      catch (err){
        console.log(err);
      }
    },

    deleteProductFromCart: async (_, args) =>{
      //if (!user) throw new AuthenticationError("Unauthenticated");
      return await Cart.updateOne(
        { _id: args._id },
        // $pull removes from array all instances!
        { $pull: {items: { product_id: args.product_id } } }
      )
    },
    deleteCart: async (_, { cartId }) => {
      let oneCart = await Cart.findOneAndRemove(
        { _id: cartId },
        { useFindAndModify: false },
      );
      console.log(oneCart);
      return await oneCart;
    },
    adminDeleteCarts: async(_, { cartIds }, {user}) => {
      let fewCarts = await Cart.deleteMany({
        _id: {
          $in: [...cartIds],
        },
      });
      return await fewCarts;
    },
  }
}
