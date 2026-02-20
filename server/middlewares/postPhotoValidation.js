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
      .withMessage("A descrição é obrigatória!")
      .bail()
      .isString()
      .withMessage("A descrição é obrigatória!")
      .bail()
      .isLength({ min: 3 })
      .withMessage("A descrição deve ter pelo menos 3 caracteres!"),
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
    body("description")
      .optional()
      .isString()
      .withMessage("O descrição é obrigatório!")
      .bail()
      .isLength({ min: 3 })
      .withMessage("O descrição deve ter pelo menos 3 caracteres!"),
  ];
};

module.exports = {
  postPhotoInsertValidation,
  postPhotoUpdateValidation,
};
