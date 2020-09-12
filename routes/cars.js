const router = require('express').Router();
const multer  = require('multer');
const xlsx2json = require('xlsx-to-json-lc');

const Cars = require('../models/cars/Cars');
const jwt = require("jsonwebtoken");

function verifyJWT(req, res, next) {
  var token = req.headers["token"];
  if (!token) return res.status(400).send({ message: "Sem token não entra." });

  jwt.verify(token, "1q2w3e4r", function(err, decoded) {
    if (err)
      return res.status(400).send({ message: "token invalido ou expirado" });

    // se tudo estiver ok, salva no request para uso posterior
    req.userId = decoded.id;
    next();
  });
}

function getFileExt(filename) {
  return filename.match(/(?<=\.)\w+/)[0];
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, './public/upload/');
    },
    filename: (req, file, callback) => {
      callback(null, `${Date.now()}.${getFileExt(file.originalname)}`);
    }
  }),
  fileFilter: (req, file, callback) => {
    if (!['xls', 'xlsx'].includes(getFileExt(file.originalname))) {
      return callback(new Error('Wrong extension type'));
    }
    callback(null, true);
  }
}).single('planilha');

router.post('/', verifyJWT,(req, res, next) => {
  upload(req, res, (err) => {
    if (err || !req.file) {
      res.json({ response: null, error: err || "No file passed" });
      return;
    }

    if (getFileExt(req.file.originalname) !== 'xlsx') {
      res.json({ response: null, error: "Extension not supported" });
      return;
    }

    try {
      xlsx2json({
        input: req.file.path,
        output: './public/uploads.json',
        lowerCaseHeaders: true
      }, async (err, result) => {
        if (err) {
          return res.json({ response: null, error: err });
        }

        const response = await new Cars(result).insert();
        if (response.error) {
          res.status(400);
        }
        res.json(response);
      })
    } catch (e) {
      res.json({ response: null, error: "Corupted excel file" });
    }
  });
});

router.get('/',verifyJWT, async (req, res) => {
  const response = await new Cars().getAll(req.query);
  let status = 200;

  if (response.err) {
    status = 400;
  }
  res.status(status).send(response);
});

module.exports = router;