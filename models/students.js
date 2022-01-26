const Joi = require("joi");
const mongoose = require("mongoose");

//Course schema using mongoose

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  phone: { type: Number, required: true, min: 5999999999, max: 9999999999 },
  isTopper: { type: Boolean, required: true },
});

// Creating Course class using mongoose models

const Student = mongoose.model("Students", courseSchema);

function validateStudent(student) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    isTopper: Joi.boolean().required(),
    phone: Joi.number().integer().min(5999999999).max(9999999999).required(),
  });
  return schema.validate(student);
}

module.exports.Student = Student;
module.exports.validate = validateStudent;
