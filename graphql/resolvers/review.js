const Review = require("../../models/Review");

module.exports = {
  // Get Single Product Reviews
  Query: {
    reviewsOneProduct: async (_, { productId }, { user }) => {
      if (!user) throw new AuthenticationError("Unauthenticated");
      let review = await Review.find({ product_id: productId });
      return review;
    },
  },

  Mutation: {
    // Create Review
    createReview: async (
      _,
      { reviewInput: { customer_id, product_id, review, rating, title } },
      { user }
    ) => {
      if (!user) throw new AuthenticationError("Unauthenticated");

      let newReview = new Review({
        customer_id,
        product_id,
        review,
        rating,
        name: user.firstname,
        title,
      });
      return await newReview.save();
    },
    deleteReview: async (_, { reviewId }, { user }) => {
      if (!user) throw new AuthenticationError("Unauthenticated");
      return await Review.findOneAndRemove(
        { $and: [{ _id: reviewId }, { customer_id: user.id }] },
        { useFindAndModify: false }
      );
    },
    adminDeleteReviews: async (_, { reviewIds }, { user }) => {
     if (!user) throw new AuthenticationError("Unauthenticated");
      let removedData = await Review.deleteMany({
        _id: {
          $in: [...reviewIds],
        },
      });
      return removedData.deletedCount === reviewIds.length;
    },
  },
};
