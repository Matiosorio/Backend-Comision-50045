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
}

module.exports = UserRepository;
