import express from 'express';
import { registerUser, loginUser } from '../Controllers/authController.js';
import {verifyToken} from "../middleware/authentication.js"
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', verifyToken , loginUser);

export default router;
