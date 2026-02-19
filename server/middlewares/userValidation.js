const { body } = require("express-validator");

const userCreateValidation = () => {
  return [
    body("username")
      .isString()
      .withMessage("O nome é obrigatório!")
      .isLength({ min: 3 })
      .withMessage("O nome deve ter pelo menos 3 caracteres!"),
    body("email")
      .isString()
      .notEmpty()
      .withMessage("O e-mail é obrigatório!")
      .bail()
      .isEmail()
      .withMessage("E-mail inválido!"),
    body("password")
      .isString()
      .notEmpty()
      .withMessage("A senha é obrigatória!")
      .bail()
      .isLength({ min: 6 })
      .withMessage("A senha deve ter pelo menos 6 caracteres!"),
    body("confirmPassword")
      .isString()
      .withMessage("A confirmação de senha é obrigatória!")
      .bail()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("As senhas não são iguais!");
        }
        return true;
      }),
  ];
};

const loginValidation = () => {
  return [
    body("email")
      .isString()
      .withMessage("O e-mail deve ser uma string!")
      .bail()
      .notEmpty()
      .withMessage("O e-mail é obrigatório!")
      .bail()
      .isEmail()
      .withMessage("E-mail inválido!"),
    body("password")
      .isString()
      .withMessage("A senha deve ser uma string!")
      .bail()
      .notEmpty()
      .withMessage("A senha é obrigatória!")
      .bail()
      .isLength({ min: 6 })
      .withMessage("A senha deve ter pelo menos 6 caracteres!"),
  ];
};

const userUpdateValidation = () => {
  return [
    body("username")
      .isString()
      .optional()
      .isLength({ min: 3 })
      .withMessage("O nome deve ter pelo menos 3 caracteres!"),
    body("password")
      .isString()
      .optional()
      .isLength({ min: 6 })
      .withMessage("A senha deve ter pelo menos 6 caracteres!"),
    body("profilePicture").isString().optional(),
    body("coverPicture").isString().optional(),
    body("desc")
      .isString()
      .optional()
      .isLength({ min: 6 })
      .withMessage("A senha deve ter pelo menos 6 caracteres!"),
    body("city")
      .isString()
      .optional()
      .isLength({ min: 6 })
      .withMessage("A senha deve ter pelo menos 6 caracteres!"),
    body("from")
      .isString()
      .optional()
      .isLength({ min: 3 })
      .withMessage("A senha deve ter pelo menos 3 caracteres!"),
  ];
};

module.exports = {
  userCreateValidation,
  loginValidation,
  userUpdateValidation,
};
