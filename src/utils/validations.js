const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter strong password");
  }
};
const validateProfileEdit = (req) => {
  const editableFeilds = [
    "firstName",
    "lastName",
    "age",
    "about",
    "photoURL",
    "gender",
    "skills",
  ];
  const isEditable = Object.keys(req.body).every((k) =>
    editableFeilds.includes(k)
  );

  if (!isEditable) throw new Error("Invalid Edit Request"); 
};

module.exports = {
  validateSignUpData,
  validateProfileEdit,
};
