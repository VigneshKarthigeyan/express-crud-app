const Joi = require("joi");
const mongoose = require("mongoose");

//Course schema using mongoose

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  author: { type: String, required: true, minlength: 3 },
  tags: {
    type: Array,
    required: true,
    validate: {
      validator: function (tags) {
        return tags && tags.length > 0;
      },
      message: "A course should have atleast one tag",
    },
  },
  date: { type: Date, default: Date.now },
  isPublished: { type: Boolean, required: true },
  price: {
    type: Number,
    required: function () {
      return this.isPublished;
    },
  },
});

// Creating Course class using mongoose models

const Course = mongoose.model("Course", courseSchema);

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    author: Joi.string().min(3).required(),
    tags: Joi.array().min(1).required(),
    isPublished: Joi.boolean().required(),
    price: Joi.number().integer().min(1),
  });
  return schema.validate(course);
}

module.exports.Course = Course;
module.exports.validate = validateCourse;
