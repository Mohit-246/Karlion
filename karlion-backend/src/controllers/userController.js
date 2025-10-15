const { User } = require("../model/dbSchema");
const generateToken = require("../utils/jwt");

//Create New user
const createUser = async (req, res) => {
  const { eamil, phone } = req.body;
  try {
    const userExist = await User.findOne({ eamil, phone });
    if (userExist) {
      res.status(400).json({ message: "User Already Exists" });
    }
    const user = await User.create(req.body);
    res.status(201).json({ user, token: generateToken(user._id) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Login User
const authUser = async (req, res) => {
  const { email, passowrd } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(passowrd))) {
      res.json(user);
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Getting User Data
const getUserData = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById({ userId });

    if (!user) {
      res.status(500).json("Error Occured");
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findByIdAndUpdate({ userId });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all users (Admin only)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE a user (Admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await user.remove();
      res.json({ message: "User removed" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createUser,
  getUserData,
  updateUserProfile,
  authUser,
  deleteUser,
  getUsers,
};
