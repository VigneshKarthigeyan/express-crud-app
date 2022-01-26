const express = require("express");
const Joi = require("joi");
const mongoose = require("mongoose");

const router = express.Router();

// const courses = [
//   { id: 1, name: "Numarical Methods" },
//   { id: 2, name: "Operational Reasearch" },
// ];

// function findCourse(id) {
//   return courses.find((course) => course.id === parseInt(id));
// }

// function validateCourse(course) {
//   const schema = Joi.object({
//     name: Joi.string().min(3).required(),
//   });
//   return schema.validate(course);
// }

// router.get("/", (req, res) => {
//   res.send(courses);
// });

// router.get("/:id", (req, res) => {
//   let course = findCourse(req.params.id);
//   if (!course)
//     return res.status(404).send(`There is no course with id ${req.params.id}`);
//   return res.send(course);
// });

// router.post("/", (req, res) => {
//   let result = validateCourse(req.body);
//   if (result.error)
//     return res.status(400).send(result.error.details[0].message);
//   let course = {
//     id: courses.length + 1,
//     name: req.body.name,
//   };
//   courses.push(course);
//   return res.send(course);
// });

// router.put("/:id", (req, res) => {
//   let course = findCourse(req.params.id);
//   if (!course)
//     return res.status(404).send(`There is no course with id ${req.params.id}`);
//   let result = validateCourse(req.body);
//   if (result.error)
//     return res.status(400).send(result.error.details[0].message);
//   course.name = req.body.name;
//   return res.send(course);
// });

// router.delete("/:id", (req, res) => {
//   let course = findCourse(req.params.id);
//   if (!course)
//     return res.status(404).send(`There is no course with id ${req.params.id}`);
//   let index = courses.indexOf(course);
//   courses.splice(index, 1);
//   return res.send(course);
// });

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
    price:Joi.number().integer().min(1)
  });
  return schema.validate(course);
}

router.get("/", async (req, res) => {
  try{
    const courses = await Course.find();
    res.send(courses);
  }
  catch (error) {
    return res.status(500).send({
      message:error.message
    });
  }
});

router.get("/:id", async (req, res) => {
  try{
    let course = await Course.findById(req.params.id);
    if (!course)
      return res.status(404).send(`There is no course with id ${req.params.id}`);
    return res.send(course);
  }
  catch (error) {
    return res.status(500).send({
      message:error.message
    });
  }
});

router.post("/", async (req, res) => {
  try {
    let course = new Course(req.body);
    let result = validateCourse(req.body);
    console.log(result);
    if (result.error)
      return res.status(400).send(result.error.details[0].message);
    console.log(course.price);
    if(course.isPublished && !course.price)
      return res.status(400).send("Path price is required");
      
    result = await course.save();
    return res.send(result);
  } 
  catch (error) {
    return res.status(500).send({
      message:error.message
    });
  }
});

router.put("/:id", async (req, res) => {
  try{
    let course = await Course.findById(req.params.id);
    if (!course)
      return res.status(404).send(`There is no course with id ${req.params.id}`);
    let result = validateCourse(req.body);
    if (result.error)
      return res.status(400).send(result.error.details[0].message);
    if(req.body.isPublished && !req.body.price)
      return res.status(400).send("Path price is required");
    course.set(req.body);
    result=await course.save();
    return res.send(result);
  }
  catch (error) {
    return res.status(500).send({
      message:error.message
    });
  }
});

router.delete("/:id", async (req, res) => {
  try{
    let course = await Course.findByIdAndRemove(req.params.id);
    if (!course)
      return res.status(404).send(`There is no course with id ${req.params.id}`);
    return res.send(course);
  }
  catch (error) {
    return res.status(500).send({
      message:error.message
    });
  }
});

module.exports = router;
