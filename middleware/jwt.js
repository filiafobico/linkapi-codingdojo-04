const jwt = require("jsonwebtoken");
const ObjectId = require('mongodb').ObjectId;

function verifyJWT(req, res, next) {
  var token = req.headers["token"];
  if (!token) return res.status(400).send({ message: "Precisa estar loggado." });

  jwt.verify(token, "1q2w3e4r", function(err, decoded) {
    if (err)
      return res.status(400).send({ message: "token invalido ou expirado" });

    // se tudo estiver ok, salva no request para uso posterior
    req.userId = decoded.id;
    next();
  });
}

module.exports = { verifyJWT };
