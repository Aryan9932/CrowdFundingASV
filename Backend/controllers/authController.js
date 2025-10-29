import {
  createUser,
  fetchUserByEmail,
  fetchUserByEmailWithPassword,
  fetchUserById,
  updateUser,
  comparePassword,
  updateLastLogin,
} from "../models/userModel.js";
import { generateToken } from "../utils/generateTokens.js";

// Register
export const registerUser = async (req, res) => {
  const {
    email,
    password,
    role = "individual",
    firstName,
    lastName,
    dob,
    gender,
    organizationName,
    orgAdminName,
    location,
  } = req.body;

  try {
    // Validate required fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Check if user already exists
    const userExists = await fetchUserByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = await createUser({
      email,
      password,
      role,
      firstName,
      lastName,
      dob,
      gender,
      organizationName,
      orgAdminName,
      location,
    });
    const token = generateToken(user.id);
    res.cookie("token", token);
    res.status(201).json({
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.first_name,
      lastName: user.last_name,
      token: token,
      message: "User registered successfully. Please verify your email.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate required fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find user by email (with password hash)
    const user = await fetchUserByEmailWithPassword(email);

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if user account is active
    if (user.status !== "active") {
      return res.status(403).json({
        message: `Account is ${user.status}. Please contact support.`,
      });
    }

    // Compare passwords
    const isPasswordValid = await comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Update last login
    await updateLastLogin(user.id);
    const token = generateToken(user.id);
    res.cookie("token", token);
    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.first_name,
      lastName: user.last_name,
      token: token,
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // From verifyToken middleware
    const { firstName, lastName, bio, location, phone } = req.body;

    // Map frontend field names to database field names
    const updates = {};
    if (firstName !== undefined) updates.first_name = firstName;
    if (lastName !== undefined) updates.last_name = lastName;
    if (bio !== undefined) updates.bio = bio;
    if (location !== undefined) updates.location = location;
    // Note: phone is not in the database schema yet, but we'll include it for future

    const updatedUser = await updateUser(userId, updates);

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        bio: updatedUser.bio,
        location: updatedUser.location,
        profilePicUrl: updatedUser.profile_pic_url,
      },
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // From verifyToken middleware
    const user = await fetchUserById(userId);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
        bio: user.bio,
        location: user.location,
        profilePicUrl: user.profile_pic_url,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};
