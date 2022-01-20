const express = require("express");
const Joi = require("joi");
const app = express();
app.use(express.json());

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

app.get("/api/courses", (req, res) => {
  res.send(courses);
});
app.get("/api/courses/:id", (req, res) => {
  let course = findCourse(req.params.id);
  if (!course)
    return res.status(404).send(`There is no course with id ${req.params.id}`);
  return res.send(course);
});

app.post("/api/courses", (req, res) => {
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

app.put("/api/courses/:id", (req, res) => {
  let course = findCourse(req.params.id);
  if (!course)
    return res.status(404).send(`There is no course with id ${req.params.id}`);
  let result = validateCourse(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);
  course.name = req.body.name;
  return res.send(course);
});

app.delete("/api/courses/:id", (req, res) => {
  let course = findCourse(req.params.id);
  if (!course)
    return res.status(404).send(`There is no course with id ${req.params.id}`);
  let index = courses.indexOf(course);
  courses.splice(index, 1);
  return res.send(course);
});

const port = process.env.PORT || 3000;
console.log(port);
app.listen(port, () => console.log(`Listening in port ${port}...`));
