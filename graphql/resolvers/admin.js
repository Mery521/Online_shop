const { UserInputError, ApolloError } = require("apollo-server");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../../models/Admin");
const Customer = require("../../models/Customer");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  Query: {
    // Get Users
    customers: async (_, __, { user }) => {
      if (!user) throw new AuthenticationError("Unauthenticated");
      let res = await Customer.find();
      return res;
    },
    adminCustomer: async (_, { id }, { user }) => {
      const errors = {};
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");
        let customer = await Customer.findOne({ _id: id });
        if (!customer) {
          errors.customer = "customer not found";
          throw new UserInputError("customer not found", { errors });
        }
        return customer;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    // Get Single Admin
    admin: async (_, __, { user }) => {
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");
        let admin = await Admin.findOne({ email: user.email });
        if (!admin) throw new UserInputError("Admin not found");

        return admin;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Mutation: {
    // let pass=await bcrypt.hash("admin01", 6);
    // Login
    adminLogin: async (_, args) => {
      const { email, password } = args;
      const errors = {};

      try {
        // Empty Check
        if (email.trim() === "") errors.email = "email must not be empty";
        if (password === "") errors.password = "password must not be empty";
        if (Object.keys(errors).length > 0) {
          throw new UserInputError("bad input", { errors });
        }

        // DB Check if admin has
        const admin = await Admin.findOne({ email });
        if (!admin) {
          errors.email = "admin not found";
          throw new UserInputError("admin not found", { errors });
        }

        // Check password
        const correctPassword = await bcrypt.compare(password, admin.password);

        if (!correctPassword) {
          errors.password = "password is incorrect";
          throw new UserInputError("password is incorrect", { errors });
        }
        const token = jwt.sign(
          { email, name: admin.firstname, id: admin.id },
          process.env.JWT_SECRET,
          {
            expiresIn: 365 * 24 * 60 * 60,
          }
        );
        admin.token = token;

        return {
          ...admin.toJSON(),
          token,
        };
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    adminAddCustomer: async (_, args, { user }) => {
      if (!user) throw new AuthenticationError("Unauthenticated");

      const {
        customerData: { firstname, lastname, password, email },
      } = args;
      const errors = {};

      if (email.trim().length === 0) errors.email = "email must not be empty";
      if (password.length === 0) errors.password = "password must not be empty";
      if (Object.keys(errors).length > 0) {
        throw new UserInputError("bad input", { errors });
      }

      const customer = await Customer.findOne({ email });

      if (customer)
        throw new ApolloError("this email address is already being used");

      const hashPassword = await bcrypt.hash(password, 6);

      const newCustomer = new Customer({
        email,
        password: hashPassword,
        firstname,
        lastname,
      });

      newCustomer.save();

      return true;
    },
    adminDeleteCustomer: async (_, args, { user }) => {
      if (!user) throw new AuthenticationError("Unauthenticated");

      const { id } = args;

      if (id.trim().length === 0) {
        throw new UserInputError("bad input");
      }

      let customer;

      try {
        customer = await Customer.findOne({ _id: id });
      } catch (error) {
        throw new UserInputError("wrong id");
      } finally {
        if (!customer) throw new UserInputError("wrong id");
      }

      customer.deleteOne();

      return true;
    },
    adminMassDeleteCustomers: async (_, args, { user }) => {
      if (!user) throw new AuthenticationError("Unauthenticated");

      const { customerIds } = args;

      if (customerIds.length === 0) {
        throw new UserInputError("bad input");
      }

      let result = true;

      try {
        await Customer.deleteMany({
          _id: { $in: customerIds },
        });
      } catch (error) {
        result = false;
      }

      return result;
    },
    adminUpdateCustomer: async (_, args, { user }) => {
      if (!user) throw new AuthenticationError("Unauthenticated");

      const { id, customerData } = args;

      if (id.trim().length === 0) {
        throw new UserInputError("bad input");
      }

      let customer;

      try {
        customer = await Customer.findOne({ _id: id });
      } catch (error) {
        throw new UserInputError("wrong id");
      } finally {
        if (!customer) throw new UserInputError("wrong id");
      }

      const updates = {};

      for (const key in customerData) {
        const element = customerData[key];

        if (element.trim().length > 0) {
          if (key === "password") {
            const hashPassword = await bcrypt.hash(element, 6);

            updates[key] = hashPassword;

            continue;
          }

          updates[key] = element;
        }
      }

      if (Object.keys(updates).length === 0) {
        throw new UserInputError("data is not provided");
      }

      await customer.updateOne(updates);

      customer.save();

      return true;
    },
  },
};
