const { auth } = require("../config/firebase");

const authGuard = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ errors: ["Acesso negado!"] });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("verifyIdToken failed:", error.code, error.message);
    return res.status(401).json({ errors: ["Token inválido!"] });
  }
};

module.exports = authGuard;
