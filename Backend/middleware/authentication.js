import { validateToken } from "../utils/generateTokens.js";

export const verifyToken = (cookieName = "token") => {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];

    console.log("Middleware ... Token Cookie Value: ", tokenCookieValue);

    if (!tokenCookieValue) {
      return res.status(401).json({ err: "User is not authenticated" });
    }

    try {
      const userPayload = validateToken(tokenCookieValue);

      
      if (!userPayload || !userPayload.id) {
        return res.status(401).json({ err: "Error validating token" });
      }

      // Attach user ID to request for use in controllers
      req.user = { userId: userPayload.id };

      console.log("User Payload in middleware, ..", req.user);
      next();
    } catch (error) {
      console.log("Error in middleware while checking token!", error);
      return res.status(401).json({ error: "Invalid token" });
    }
  };
};
