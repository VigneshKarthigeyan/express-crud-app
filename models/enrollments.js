const mongoose = require("mongoose");
const Joi = require("joi");

const enrollmentSchema = new mongoose.Schema({
  enrolledDate: { type: Date, required: true },
  validityEndDate: { type: Date, required: true },
  price: { type: Number, required: true, min: 1 },
  student: {
    type: new mongoose.Schema({
      _id:{ type: String, required: true },
      name: { type: String, required: true, minlength: 3 },
      phone: { type: Number, required: true, min: 5999999999, max: 9999999999 },
    }),
  },
  course: {
    type: new mongoose.Schema({
      _id:{ type: String, required: true },
      name: { type: String, required: true, minlength: 3 },
      author: { type: String, required: true, minlength: 3 },
    }),
  },
});

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

function validateEnrollment(enrollment) {
  const schema = Joi.object({
    studentId: Joi.string().required(),
    courseId: Joi.string().required(),
  });
  return schema.validate(enrollment);
}

module.exports.enrollmentSchema = enrollmentSchema;
module.exports.Enrollment = Enrollment;
module.exports.validate = validateEnrollment;
