import pool from "../config/db.js";
import bcrypt from "bcryptjs";

/**
 * PostgreSQL User Model
 * Maps to the 'users' table in NeonDB
 */

// Create a new user
export const createUser = async (userData) => {
  const {
    email,
    password,
    role = "individual", // 'individual' or 'organization'
    firstName,
    lastName,
    dob,
    gender,
    organizationName,
    orgAdminName,
    location,
  } = userData;

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const query = `
    INSERT INTO users (
      email, password_hash, role, first_name, last_name, dob, gender,
      organization_name, org_admin_name, location, status, is_email_verified
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'active', false)
    RETURNING id, email, role, first_name, last_name, created_at
  `;

  const values = [
    email,
    passwordHash,
    role,
    firstName || null,
    lastName || null,
    dob || null,
    gender || null,
    organizationName || null,
    orgAdminName || null,
    location || null,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

// Find user by ID
export const fetchUserById = async (id) => {
  const query = `
    SELECT id, email, role, first_name, last_name, dob, gender, 
           profile_pic_url, bio, location, organization_name, 
           org_verified, website, status, is_email_verified, 
           created_at, updated_at
    FROM users 
    WHERE id = $1
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Find user by email
export const fetchUserByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email = $1`;
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

// Find user by email (with password for authentication)
export const fetchUserByEmailWithPassword = async (email) => {
  const query = `
    SELECT id, email, password_hash, role, first_name, last_name, status
    FROM users 
    WHERE email = $1
  `;
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

// Get all users
export const fetchAllUsers = async () => {
  const query = `
    SELECT id, email, role, first_name, last_name, organization_name,
           status, is_email_verified, created_at
    FROM users 
    ORDER BY created_at DESC
  `;
  const result = await pool.query(query);
  return result.rows;
};

// Update user profile
export const updateUser = async (id, updates) => {
  const allowedFields = [
    "first_name",
    "last_name",
    "dob",
    "gender",
    "profile_pic_url",
    "bio",
    "location",
    "website",
    "organization_name",
    "org_admin_name",
  ];

  const fields = [];
  const values = [];
  let paramIndex = 1;

  Object.keys(updates).forEach((key) => {
    if (allowedFields.includes(key) && updates[key] !== undefined) {
      fields.push(`${key} = $${paramIndex}`);
      values.push(updates[key]);
      paramIndex++;
    }
  });

  if (fields.length === 0) {
    throw new Error("No valid fields to update");
  }

  fields.push(`updated_at = NOW()`);
  values.push(id);

  const query = `
    UPDATE users 
    SET ${fields.join(", ")}
    WHERE id = $${paramIndex}
    RETURNING id, email, first_name, last_name, profile_pic_url, bio, location
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
};

// Update user password
export const updateUserPassword = async (id, newPassword) => {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(newPassword, salt);

  const query = `
    UPDATE users 
    SET password_hash = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING id, email
  `;

  const result = await pool.query(query, [passwordHash, id]);
  return result.rows[0];
};

// Verify user email
export const verifyUserEmail = async (id) => {
  const query = `
    UPDATE users 
    SET is_email_verified = true, updated_at = NOW()
    WHERE id = $1
    RETURNING id, email, is_email_verified
  `;

  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Update last login
export const updateLastLogin = async (id) => {
  const query = `
    UPDATE users 
    SET last_login = NOW()
    WHERE id = $1
  `;

  await pool.query(query, [id]);
};

// Compare password for authentication
export const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

// Delete user
export const deleteUser = async (id) => {
  const query = `DELETE FROM users WHERE id = $1 RETURNING id`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};
