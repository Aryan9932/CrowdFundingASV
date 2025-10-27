import {
  createUser,
  fetchUserByEmail,
  fetchUserByEmailWithPassword,
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
