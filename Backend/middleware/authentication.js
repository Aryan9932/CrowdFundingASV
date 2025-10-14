import { validateToken } from "../utils/generateTokens";

export const verifyToken = (cookieName = "token") => {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];

    console.log("Middleware ... Token Cookie Value: ", tokenCookieValue);

    if (!tokenCookieValue) {
      return res.status(401).json({ err: "User is not authenticated" });
    }

    try {
      const userPayload = validateToken(tokenCookieValue);

      if (!userPayload || !userPayload.userId) {
        return res.status(401).json({ err: "Error validating token" });
      }

      req.user = userPayload;

      console.log("User Payload in middleware, ..", req.user);
      next();
    } catch (error) {
        console.log("Error in middleware while checking token!", error);
        return res.status(401).json({ error: "Invalid token" });
    }
  };
};

