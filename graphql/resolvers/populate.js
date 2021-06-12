module.exports = {
  Review: {
    customer_id: async (review) => {
      return (await review.populate("customer_id").execPopulate()).customer_id;
    },
    product_id: async (review) => {
      return (await review.populate("product_id").execPopulate()).product_id;
    },
  },
  Product: {
    categories: async (product) => {
      return (await product.populate("categories").execPopulate()).categories;
    },
  },
  Cart: {
    customerId: async (cart) => {
      return (await cart.populate("customerId").execPopulate()).customerId;
    },
  },
  //   // items: async (cart) => {
  //   //   console.log("cart ", cart);
  //   //   return await cart
  //   //     .populate({
  //   //       path: "items",
  //   //       populate: {
  //   //         path: "productId",
  //   //         model: "Product",
  //   //       },
  //   //     })
  //   //     .exec((err, data) => {
  //   //       console.log("data ",data);
  //   //     });
  //   // },
  // },
  // CartItem: {
  //   productId: async (cart) => {
  //     console.log("cart ", cart);
  //     return (
  //       await cart
  //         .populate({
  //           path: "items",
  //           populate: {
  //             path: "productId",
  //             model: "Product",
  //           },
  //         })
  //         .execPopulate()
  //     ).then((data) => console.log("data", data));
  //   },
  // },
  // CartItem: {
  //   procuctId: async (cart) => {
  //     return await cart
  //       .populate({
  //         path: "items",
  //         populate: {
  //           path: "productId",
  //           model: "Product",
  //         },
  //       })
  //       .execPopulate()
  //       .then((data) => console.log(data));
  //   },
  // },
  // --------
  // await Cart.findOne({ customerId, active: true })
  // .populate({
  //   path: "items",
  //   populate: {
  //     path: "productId",
  //     model: "Product",
  //   },
  // })
  // .exec((err, doc) => {
  //   //  console.log("product ",doc.items[0].productId);
  //   return (data = doc);
  // });
};
