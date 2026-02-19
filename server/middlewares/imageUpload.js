const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Verifica se o diretório existe, caso contrário, cria
const ensureDirectoryExistence = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

//Destination to store image
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "";

    if (req.baseUrl.includes("users")) {
      folder = "users";
    } else if (req.baseUrl.includes("posts")) {
      folder = "posts";
    }

    const uploadPath = `uploads/${folder}/`;
    ensureDirectoryExistence(uploadPath); // Garante que o diretório existe

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const randomName = Math.random().toString(36).substring(2, 10);
    cb(null, randomName + path.extname(file.originalname));
    //cb(null, Date.now() + path.extname(file.originalname));
  },
});

const imageUpload = multer({
  storage: imageStorage,
  fileFilter: (req, file, cb) => {
    try {
      const filetypes = /jpeg|jpg|png|gif|webp/;
      const mimetype = filetypes.test(file.mimetype);
      const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
      );

      if (mimetype && extname) {
        return cb(null, true);
      } else {
        return cb(new Error("Por favor, envie apenas jpeg, jpg, png ou gif!"));
      }
    } catch (error) {
      return cb(new Error("Erro ao processar o arquivo de imagem!"));
    }

    // if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    //     return cb(new Error('Por favor, envie apenas imagens!'));
    // }
    // cb(undefined, true);
  },
});

module.exports = { imageUpload };
