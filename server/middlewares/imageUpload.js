const multer = require("multer");

// Usamos memória, não disco
const storage = multer.memoryStorage();

const imageUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(file.originalname.toLowerCase());

    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error("Envie apenas imagens válidas!"));
    }
  },
});

module.exports = { imageUpload };
