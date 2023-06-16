const { User, validateUser } = require('../models/User.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// dotenv
require('dotenv').config();
// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users)
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server error' })
  }
}

// Create user
const createUser = async (req, res) => {
  try {
    // Validate request body against the user model
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).json({ success: false, error: error.details[0].message })
    }
    // Check if the email is already registered
    const existingUser = await User.findOne({ email: req.body.email })
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Email already exists' });
    }
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    // Create new user instance with hashed password
    const user = new User({
      names: req.body.names,
      email: req.body.email,
      phone: req.body.phone,
      nationalId: req.body.nationalId,
      password: hashedPassword
    });

    // Save the user
    await user.save();

    res.status(201).json({
      success: true,
      user: user,
      message: "user created successfully"
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

// Get a specific user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update a user by ID
const updateUser = async (req, res) => {
  try {
    // Validate the request body against the user schema
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: 'Invalid password' });
    }

    const secret = process.env.SECRET;
    
    //jwt payload to encrypt 
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.userRoles // Assuming you have a 'role' property in your user model
    };
    // Generate a JWT token
    const token = jwt.sign(payload, secret, { expiresIn: '10h' });

    // Return the token and user details
    res.json({ success: true, token, user });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};



module.exports = { getUsers, createUser, getUserById, updateUser, deleteUser,login };