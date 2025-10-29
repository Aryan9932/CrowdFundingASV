import { validateToken } from "../utils/generateTokens.js";

export const verifyToken = (cookieName = "token") => {
  return (req, res, next) => {
    // Check for token in cookie first, then Authorization header
    let token = req.cookies[cookieName];
    
    // If no cookie, check Authorization header
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7); // Remove 'Bearer ' prefix
      }
    }

    console.log("Middleware ... Token Value: ", token ? "Token present" : "No token");

    if (!token) {
      return res.status(401).json({ err: "User is not authenticated" });
    }

    try {
      const userPayload = validateToken(token);

      
      if (!userPayload || !userPayload.id) {
        return res.status(401).json({ err: "Error validating token" });
      }

      // Attach user ID to request for use in controllers
      req.user = { userId: userPayload.id };

      console.log("User authenticated, userId:", req.user.userId);
      next();
    } catch (error) {
      console.log("Error in middleware while checking token!", error);
      return res.status(401).json({ error: "Invalid token" });
    }
  };
};
