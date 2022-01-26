const express = require("express");
const { Course, validate } = require("../models/courses");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.send(courses);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course)
      return res
        .status(404)
        .send(`There is no course with id ${req.params.id}`);
    return res.send(course);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    let course = new Course(req.body);
    let result = validate(req.body);
    console.log(result);
    if (result.error)
      return res.status(400).send(result.error.details[0].message);
    console.log(course.price);
    if (course.isPublished && !course.price)
      return res.status(400).send("Path price is required");

    result = await course.save();
    return res.send(result);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course)
      return res
        .status(404)
        .send(`There is no course with id ${req.params.id}`);
    let result = validate(req.body);
    if (result.error)
      return res.status(400).send(result.error.details[0].message);
    if (req.body.isPublished && !req.body.price)
      return res.status(400).send("Path price is required");
    course.set(req.body);
    result = await course.save();
    return res.send(result);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let course = await Course.findByIdAndRemove(req.params.id);
    if (!course)
      return res
        .status(404)
        .send(`There is no course with id ${req.params.id}`);
    return res.send(course);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
});

module.exports = router;
