const { body } = require("express-validator");

const postPhotoInsertValidation = () => {
  return [
    body("title")
      .not()
      .equals("undefined")
      .withMessage("A descrição é obrigatória!")
      .bail()
      .isLength({ min: 3 })
      .withMessage("A descrição deve ter pelo menos 3 caracteres!"),
    body("body")
      .not()
      .equals("undefined")
      .withMessage("O corpo do post é obrigatório!")
      .bail()
      .isString()
      .withMessage("O corpo do post deve ser uma string!")
      .bail()
      .isLength({ min: 3 })
      .withMessage("O corpo do post deve ter pelo menos 3 caracteres!"),
    body("img").custom((value, { req }) => {
      if (!req.file) {
        throw new Error("A imagem é obrigatória!");
      }
      return true;
    }),
  ];
};

const postPhotoUpdateValidation = () => {
  return [
    body("title")
      .not()
      .equals("undefined")
      .withMessage("A descrição é obrigatória!")
      .bail()
      .isLength({ min: 3 })
      .withMessage("A descrição deve ter pelo menos 3 caracteres!")
      .optional(),
    body("body")
      .not()
      .equals("undefined")
      .withMessage("O corpo do post é obrigatório!")
      .bail()
      .isString()
      .withMessage("O corpo do post deve ser uma string!")
      .bail()
      .isLength({ min: 3 })
      .withMessage("O corpo do post deve ter pelo menos 3 caracteres!")
      .optional(),
  ];
};

module.exports = {
  postPhotoInsertValidation,
  postPhotoUpdateValidation,
};
