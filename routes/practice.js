const express = require("express");
const Joi = require("joi");

const router = express.Router();

const courses = [
  { id: 1, name: "Numarical Methods" },
  { id: 2, name: "Operational Reasearch" },
];

function findCourse(id) {
  return courses.find((course) => course.id === parseInt(id));
}

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  return schema.validate(course);
}

router.get("/", (req, res) => {
  res.send(courses);
});

router.get("/:id", (req, res) => {
  let course = findCourse(req.params.id);
  if (!course)
    return res.status(404).send(`There is no course with id ${req.params.id}`);
  return res.send(course);
});

router.post("/", (req, res) => {
  let result = validateCourse(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);
  let course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  return res.send(course);
});

router.put("/:id", (req, res) => {
  let course = findCourse(req.params.id);
  if (!course)
    return res.status(404).send(`There is no course with id ${req.params.id}`);
  let result = validateCourse(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);
  course.name = req.body.name;
  return res.send(course);
});

router.delete("/:id", (req, res) => {
  let course = findCourse(req.params.id);
  if (!course)
    return res.status(404).send(`There is no course with id ${req.params.id}`);
  let index = courses.indexOf(course);
  courses.splice(index, 1);
  return res.send(course);
});
