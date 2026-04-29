// Request → Authorization Header → Extract Token → Verify → Attach userId → Next()




import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized: No token" });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Invalid format" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
 
   
    req.userId = decoded.id;
    
    

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};