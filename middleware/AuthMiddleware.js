import jwt from "jsonwebtoken";

const secret = "BLOG";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    if (token) {
      jwt.verify(token, secret, (error, decode) => {
        if (error) {
          return res.status(401).json({ error: "Invalid token" });
        }
        console.log("::::::decode:::::::::", decode);
        req.auth = decode;
        next();
      });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default authMiddleware;
