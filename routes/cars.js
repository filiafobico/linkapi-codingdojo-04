const router = require('express').Router();
const multer  = require('multer');
const xlsx2json = require('xlsx-to-json-lc');

const Cars = require('../models/cars/Cars');

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

router.post('/', (req, res, next) => {
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

module.exports = router;