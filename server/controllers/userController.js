const User = require("../models/user");
const UserDTO = require("../dto/userDto");
const { handleAsync } = require("../middleware/handleAsync");
const Card = require("../models/card");
const CardDTO = require("../dto/cardDto");
const Database = require("../utils/db");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/**
 * @function createUser
 * @description Create a new user in the system. If the role is 'admin', a card_id must be provided. If a card_id is provided, the user is created as a VIP user. Otherwise, the user is created with a 'user' role.
 * @async
 * @param {Object} req - HTTP request object containing the user data in `req.body`.
 * @param {string} req.body.name - The name of the user.
 * @param {string} req.body.email - The email of the user.
 * @param {string} req.body.phone - The phone number of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {string} [req.body.card_id] - The card ID for VIP users.
 * @param {string} req.body.role - The role of the user (e.g., "user", "admin", "userVIP").
 * @param {Object} res - HTTP response object to send the response to the client.
 * @returns {void}
 * @throws {Error} If there is an error in user creation, hashing the password, saving the user to the database, or creating the user in the database.
 * @response {Object} If successful, responds with the created user and a success message. The user object is an instance of UserDTO.
 * @response {Object} If the creation fails, responds with an error message and the error object.
 */
exports.createUser = async (req, res) => {
  const { name, email, phone, password, card_id, role } = req.body;

  Database.getInstance();
  const client = mongoose.connection.client;
  const cineDB = client.db("cineCampus");

  const { result: existingUser, error: existingUserError } = await handleAsync(() => User.findOne({ email }));

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const { result: hashedPassword, error: hashError } = await handleAsync(() => bcrypt.hash(password, 10));

  if (hashError) {
    return res.status(500).json({ message: "Error hashing password", error: hashError });
  }

  if (role === "admin" && !card_id) {
    return res.status(400).json({
      message: "Cannot create user with role 'admin' without a card_id",
    });
  }

  if (role === "admin") {
    const admin = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "admin",
    });

    const { result: newAdmin, error: newAdminError } = await handleAsync(() =>
      admin.save()
    );

    if (newAdminError || !newAdmin) {
      console.error("Error saving admin:", newAdminError);

      return res.status(500).json({
        message: "Error saving admin",
        error: newAdminError,
      });
    }

    // const { result: adminCommandResult, error: adminCommandError } =
    //   await handleAsync(() =>
    //     cineDB.command({
    //       createUser: newAdmin.name,
    //       pwd: newAdmin.password,
    //       roles: [{ role: "adminCine", db: "cineCampus" }],
    //     })
    //   );

    // if (adminCommandError) {
    //   console.error("Error creating admin in DB:", adminCommandError);

    //   await handleAsync(() => User.findByIdAndDelete(newAdmin._id));
    //   return res.status(500).json({
    //     message: "Error creating admin in DB",
    //     error: adminCommandError,
    //   });
    // }

    // return res.status(201).json({
    //   message: "Admin created successfully",
    //   user: new UserDTO(newAdmin),
    // });
  }

  if (card_id) {
    const { result: card, error: cardError } = await handleAsync(() =>
      Card.findById(card_id)
    );
    if (cardError || !card) {
      console.log({ message: "Card not found", error: cardError });
    }

    const userVIP = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "userVIP",
      card_id,
    });

    const { result: newUserVIP, error: userVIPSaveError } = await handleAsync(
      () => userVIP.save()
    );
    if (userVIPSaveError || !newUserVIP) {
      return res
        .status(500)
        .json({ message: "Error saving userVIP", error: userVIPSaveError });
    }

    // const { result: userVIPCommandResult, error: userVIPCommandError } =
    //   await handleAsync(() =>
    //     cineDB.command({
    //       createUser: newUserVIP.name,
    //       pwd: newUserVIP.password,
    //       roles: [{ role: "userVIP", db: "cineCampus" }],
    //     })
    //   );
    // if (userVIPCommandError) {
    //   return res.status(500).json({
    //     message: "Error creating userVIP in DB",
    //     error: userVIPCommandError,
    //   });
    // }

    // return res.status(201).json({
    //   message: "UserVIP created successfully",
    //   user: new UserDTO(newUserVIP),
    //   card: new CardDTO(card),
    // });
  } else {
    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "user",
    });

    const { result: newUser, error: userSaveError } = await handleAsync(() =>
      user.save()
    );
    if (userSaveError || !newUser) {
      return res
        .status(500)
        .json({ message: "Error saving user", error: userSaveError });
    }

    // const { result: userCommandResult, error: userCommandError } =
    //   await handleAsync(() =>
    //     cineDB.command({
    //       createUser: newUser.name,
    //       pwd: newUser.password,
    //       roles: [{ role: "user", db: "cineCampus" }],
    //     })
    //   );
    // if (userCommandError) {
    //   return res.status(500).json({
    //     message: "Error creating user in DB",
    //     error: userCommandError,
    //   });
    // }

    // return res.status(201).json({
    //   message: "User created successfully",
    //   user: new UserDTO(newUser),
    // });
  }
};

/**
 * @function getUsersDetails
 * @description Retrieve user details by ID or filter users by role.
 * @async
 * @method
 * @param {Object} req - HTTP request object containing the user ID in `req.params` or role in `req.body`.
 * @param {string} [req.params.id] - The ID of the user to retrieve.
 * @param {string} [req.body.role] - The role to filter users by.
 * @param {Object} res - HTTP response object to send the response to the client.
 * @returns {void}
 * @throws {Error} Throws an error if the user retrieval fails.
 * @response {Object} Responds with the user details if successful.
 * @response {Object} Responds with an error message if the user is not found or retrieval fails.
 */
exports.getUsersDetails = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
  
    let query;
    if (id) {
      query = User.findById(id);
    } else if (role) {
      query = User.aggregate([
        { $match: { role } },
        { $sort: { name: 1 } },
      ]);
    } else {
      return res.status(400).json({ message: "ID or role is required" });
    }
  
    const { result: users, error: userError } = await handleAsync(() => query.exec());
  
    if (userError || !users || (Array.isArray(users) && users.length === 0)) {
      return res.status(404).json({ message: "User(s) not found", error: userError });
    }
  
    if (id) {
      return res.status(200).json(new UserDTO(users));
    } else {
      return res.status(200).json(users.map(user => new UserDTO(user)));
    }
  };

/**
 * @function updateRole
 * @description Update the role of a user based on the provided role and card_id. Ensures the card is valid before assigning it.
 * @async
 * @method
 * @param {Object} req - HTTP request object containing the user data in `req.body` and user ID in `req.params`.
 * @param {string} req.body.role - The new role of the user (e.g., "admin", "userVIP", "user").
 * @param {string} req.body.card_id - The card ID associated with the user.
 * @param {string} req.params.id - The ID of the user to update.
 * @param {Object} res - HTTP response object to send the response to the client.
 * @returns {void}
 * @throws {Error} Throws an error if the role update fails.
 * @response {Object} Responds with the updated user if successful.
 * @response {Object} Responds with an error message if the update fails.
 */
exports.updateRole = async (req, res) => {
    const { role, card_id } = req.body;
    const { id } = req.params;
  
    console.log(role, card_id, id);
  
    const db = Database.getInstance();
    const client = mongoose.connection.client;
    const cineDB = client.db("cineCampus");
  
    const { result: user, error: userError } = await handleAsync(() => User.findById(id));
  
    
    if (userError || !user) {
        return res.status(404).json({ message: "User not found", error: userError });
    }
    
    if ((role === "admin" || role === "userVIP") && !card_id) {
        return res.status(400).json({ message: "Card ID is required for admin or userVIP roles" });
    }
    
    let card = null;
    if (card_id) {
        const { result, error } = await handleAsync(() => Card.findById(card_id));
        card = result;
        if (error || !card) {
            return res.status(404).json({ message: "Card not found", error });
        } else if (card.validity === false) {
            return res.status(400).json({ message: "Card is not valid" });
        }
    }
    
    let updateData = { role: "user", card_id: null };

    console.log(user.name); 
  
    await cineDB.command({
      revokeRolesFromUser: user.name, 
      roles: [
        { role: "adminCine", db: "cineCampus" },
        { role: "userVIP", db: "cineCampus" },
        { role: "user", db: "cineCampus" }
      ],
    });
  
    if (role === "admin") {
      updateData = { role: "admin", card_id: card._id };
      await cineDB.command({
        grantRolesToUser: user.name, 
        roles: [{ role: "adminCine", db: "cineCampus" }],
      });
    } else if (role === "userVIP") {
      updateData = { role: "userVIP", card_id: card._id };
      await cineDB.command({
        grantRolesToUser: user.name, 
        roles: [{ role: "userVIP", db: "cineCampus" }],
      });
    } else if (role === "user") {
      updateData = { role: "user", card_id: null };
      await cineDB.command({
        grantRolesToUser: user.name, 
        roles: [{ role: "user", db: "cineCampus" }],
      });
    }
  
    const { result: updatedUser, error: updateUserError } = await handleAsync(() =>
      User.findOneAndUpdate({ _id: id }, updateData, {
        new: true,
        runValidators: true,
      })
    );
  
    if (updateUserError || !updatedUser) {
      return res.status(404).json({ message: "User not found", error: updateUserError });
    }
  
    return res.status(200).json({
      message: `${updatedUser.role} updated successfully`,
      user: new UserDTO(updatedUser),
    });
  };