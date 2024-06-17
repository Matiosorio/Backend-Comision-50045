const UserModel = require("../models/user.model.js");

class UserRepository {
  async createUser(userData) {
    try {
      const newUser = new UserModel(userData);
      await newUser.save();
      return newUser;
    } catch (error) {
      throw new Error("Error al crear usuario en la base de datos");
    }
  }

  async findUserByEmail(email) {
    try {
      const user = await UserModel.findOne({ email });
      return user;
    } catch (error) {
      throw new Error("Error al encontrar usuario por email");
    }
  }

  async findById(id) {
    try {
      return await UserModel.findById(id);
    } catch (error) {
      throw error;
    }
  }

}

module.exports = UserRepository;
