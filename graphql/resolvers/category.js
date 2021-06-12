const { UserInputError, AuthenticationError } = require("apollo-server");
const Category = require("../../models/Category");
const Product = require("../../models/Product");

module.exports = {
  Query: {
    categories: async (_, __, { user }) => {
      if (!user) throw new AuthenticationError("Unauthenticated");

      const res = await Category.find();

      return res; 
    },

    adminGetCategories: async (_, __, { user }) => {
      if (!user) throw new AuthenticationError("Unauthenticated");

      const res = await Category.find();

      return { items: res, total: res.length };
    },

    adminGetCategory: async (_, args, { user }) => {
      if (!user) throw new AuthenticationError("Unauthenticated");

      const { categoryId = "" } = args;

      try {
        const category = await Category.findOne({ _id: categoryId });

        if (!category) {
          throw new UserInputError("category not found");
        }

        return category;
      } catch (error) {
        throw error;
      }
    },

    getCategoryProducts: async (_, args, { user }) => {
      if (!user) throw new AuthenticationError("Unauthenticated");

      const { categoryId = "" } = args;

      try {
        const res = await Product.find({ "categories._id": categoryId });

        if (!res) {
          throw new UserInputError("products not found");
        }

        return { products: res, total: res.length };
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    adminAddCategory: async (_, args, { user }) => {
      if (!user) throw new AuthenticationError("Unauthenticated");

      const { categoryData: { title = "", parent = "" } } = args;

      if (!title.trim()) {
        throw new UserInputError("bad input");
      }

      if (parent.trim()) {
        try {
          const res = await Category.exists({ _id: parent });

          if (!res) {
            throw new UserInputError("parent not found");
          }
        } catch (error) {
          throw new UserInputError("parent not found");
        }
      }

      let result = true;

      try {
        await Category.create({ title: title.trim(), parent });
      } catch (error) {
        result = false;
      }

      return result;
    },

    adminUpdateCategory: async (_, args, { user }) => {
      if (!user) throw new AuthenticationError("Unauthenticated");

      const { categoryId = "", categoryData } = args;

      if (!categoryId.trim()) {
        throw new UserInputError("bad input");
      }

      if (!Object.keys(categoryData).length) {
        throw new UserInputError("nothing to update");
      }

      if (typeof categoryData.title === "string" && !categoryData.title.trim()) {
        throw new UserInputError("bad input (title)");
      }

      if (typeof categoryData.parent === "string" && categoryData.parent.trim()) {
        try {
          const res = await Category.exists({ _id: categoryData.parent });

          if (!res) {
            throw new UserInputError("parent not found");
          }
        } catch (error) {
          throw new UserInputError("parent not found");
        }
      }

      let result = true;

      try {
        const res = await Category.findOneAndUpdate(
          { _id: categoryId },
          categoryData,
          { useFindAndModify: false }
        );

        if (!res) {
          throw new UserInputError("category not found");
        }
      } catch (error) {
        result = false;
      }

      return result;
    },

    adminDeleteCategory: async (_, args, { user }) => {
      if (!user) throw new AuthenticationError("Unauthenticated");

      const { categoryId = "" } = args;

      if (!categoryId.trim()) {
        throw new UserInputError("bad input");
      }

      let category;

      try {
        category = await Category.findOne({ _id: categoryId });
      } catch (error) {
        throw new UserInputError("wrong id");
      }

      if (!category) throw new UserInputError("wrong id");

      await Category.deleteMany({ parent: category._id });

      await category.deleteOne();

      return true;
    },
  },
};
