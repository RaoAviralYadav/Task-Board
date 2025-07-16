const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async function (req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded?.user?.id || decoded.id; // handle both token formats
    if (!userId) return res.status(403).json({ message: "Invalid token format" });

    const user = await User.findById(userId).select("name _id");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    res.status(403).json({ message: "Token is invalid" });
  }
};


// const jwt = require("jsonwebtoken");

// module.exports = function (req, res, next) {
//   const token = req.headers["authorization"];
//   if (!token) return res.status(401).json({ message: "No token, authorization denied" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     res.status(403).json({ message: "Token is invalid" });
//   }
// };
