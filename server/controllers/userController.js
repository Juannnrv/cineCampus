const User = require("../models/user");
const UserDTO = require("../dto/userDto");
const { handleAsync } = require("../middleware/handleAsync");
const Card = require("../models/card");
const CardDTO = require("../dto/cardDto");
const Database = require("../utils/db");
const mongoose = require("mongoose");

/**
 * @function createUser
 * @description Create a new user in the system. If the role is 'admin', a card_id must be provided. If a card_id is provided, the user is created as a VIP user. Otherwise, the user is created with a 'user' role.
 * @async
 * @method
 * @param {Object} req - HTTP request object containing the user data in `req.body`.
 * @param {string} req.body.name - The name of the user.
 * @param {string} req.body.email - The email of the user.
 * @param {string} req.body.phone - The phone number of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {string} [req.body.card_id] - The card ID for VIP users.
 * @param {string} req.body.role - The role of the user (e.g., "user", "admin", "userVIP").
 * @param {Object} res - HTTP response object to send the response to the client.
 * @returns {void}
 * @throws {Error} Throws an error if the user creation fails.
 * @response {Object} Responds with the created user if successful.
 * @response {Object} Responds with an error message if the creation fails.
 */
exports.createUser = async (req, res) => {
  const { name, email, phone, password, card_id, role } = req.body;

  const db = Database.getInstance();
  const client = mongoose.connection.client;
  const cineDB = client.db("cineCampus");

  if (role === "admin" && !card_id) {
    return res.status(400).json({ message: "Cannot create user with role 'admin' without a card_id" });
  }

  if (role === "admin") {
    const admin = new User({
      name,
      email,
      phone,
      password,
      role: "admin",
    });

    const { result: newAdmin, error: newAdminError } = await handleAsync(() => admin.save());

    if (newAdminError || !newAdmin) {
      console.error("Error saving admin:", newAdminError);
      
      return res.status(500).json({
        message: "Error saving admin",
        error: newAdminError,
      });
    }

    const { result: adminCommandResult, error: adminCommandError } = await handleAsync(() => cineDB.command({
      createUser: newAdmin.name,
      pwd: newAdmin.password,
      roles: [{ role: "adminCine", db: "cineCampus" }],
    }));

    if (adminCommandError) {
      console.error("Error creating admin in DB:", adminCommandError);
      
      await handleAsync(() => User.findByIdAndDelete(newAdmin._id));
      return res.status(500).json({
        message: "Error creating admin in DB",
        error: adminCommandError,
      });
    }

    return res.status(201).json({
      message: "Admin created successfully",
      user: new UserDTO(newAdmin),
    });
  }

  if (card_id) {
    const { result: card, error: cardError } = await handleAsync(() => Card.findById(card_id));
    if (cardError || !card) {
      console.log({ message: "Card not found", error: cardError });
    }

    const userVIP = new User({
      name,
      email,
      phone,
      password,
      role: "userVIP",
      card_id,
    });

    const { result: newUserVIP, error: userVIPSaveError } = await handleAsync(() => userVIP.save());
    if (userVIPSaveError || !newUserVIP) {
      return res.status(500).json({ message: "Error saving userVIP", error: userVIPSaveError });
    }

    const { result: userVIPCommandResult, error: userVIPCommandError } = await handleAsync(() => cineDB.command({
      createUser: newUserVIP.name,
      pwd: newUserVIP.password,
      roles: [{ role: "userVIP", db: "cineCampus" }],
    }));
    if (userVIPCommandError) {
      return res.status(500).json({ message: "Error creating userVIP in DB", error: userVIPCommandError });
    }

    return res.status(201).json({
      message: "UserVIP created successfully",
      user: new UserDTO(newUserVIP),
      card: new CardDTO(card),
    });
  } else {
    const user = new User({
      name,
      email,
      phone,
      password,
      role: "user",
    });

    const { result: newUser, error: userSaveError } = await handleAsync(() => user.save());
    if (userSaveError || !newUser) {
      return res.status(500).json({ message: "Error saving user", error: userSaveError });
    }

    const { result: userCommandResult, error: userCommandError } = await handleAsync(() => cineDB.command({
      createUser: newUser.name,
      pwd: newUser.password,
      roles: [{ role: "user", db: "cineCampus" }],
    }));
    if (userCommandError) {
      return res.status(500).json({ message: "Error creating user in DB", error: userCommandError });
    }

    return res.status(201).json({
      message: "User created successfully",
      user: new UserDTO(newUser),
    });
  }
};