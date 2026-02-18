const User = require("../models/User");
const Employee = require("../models/Employee");
const bcrypt = require("bcryptjs");

const resolvers = {
  Query: {
    login: async (_, { username, email, password }) => {
      const user = await User.findOne({
        $or: [{ username }, { email }]
      });

      if (!user) {
        throw new Error("User not found");
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw new Error("Invalid password");
      }

      return user;
    },

    getAllEmployees: async () => {
      const employees = await Employee.find();
      return employees;
    },

    searchEmployeeByEid: async (_, { eid }) => {
      const employee = await Employee.findById(eid);

      if (!employee) {
        throw new Error("Employee not found");
      }

      return employee;
    },

    searchEmployeeByDesignationOrDepartment: async (_, { designation, department }) => {
      const query = {};

      if (designation) query.designation = designation;
      if (department) query.department = department;

      const employees = await Employee.find(query);
      return employees;
    }
  },

  Mutation: {
    signup: async (_, { username, email, password }) => {
      const existingUser = await User.findOne({
        $or: [{ username }, { email }]
      });

      if (existingUser) {
        throw new Error("User already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        username,
        email,
        password: hashedPassword
      });

      await newUser.save();

      return newUser;
    },

    addEmployee: async (_, args) => {
      const existing = await Employee.findOne({ email: args.email });
      if (existing) {
        throw new Error("Employee email already exists");
      }

      const newEmployee = new Employee({
        ...args,
        created_at: new Date(),
        updated_at: new Date()
      });

      await newEmployee.save();
      return newEmployee;
    },

    updateEmployeeByEid: async (_, { eid, ...updates }) => {
      const updatedEmployee = await Employee.findByIdAndUpdate(
        eid,
        { ...updates, updated_at: new Date() },
        { new: true }
      );

      if (!updatedEmployee) {
        throw new Error("Employee not found");
      }

      return updatedEmployee;
    },

    deleteEmployeeByEid: async (_, { eid }) => {
      const deletedEmployee = await Employee.findByIdAndDelete(eid);

      if (!deletedEmployee) {
        throw new Error("Employee not found");
      }

      return deletedEmployee;
    }
  }
};

module.exports = resolvers;
