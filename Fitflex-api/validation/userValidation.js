const Joi = require("joi");

const UserValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().allow(""),
    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&]).{8,}$/)
      .required()
      .messages({
        "string.pattern.base":
          "Password must include uppercase, lowercase, number, and special character.",
      }),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

module.exports = UserValidation;
