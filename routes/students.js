const express = require("express");
const { Student, validate } = require("../models/students");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.send(students);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    let student = await Student.findById(req.params.id);
    if (!student)
      return res
        .status(404)
        .send(`There is no student with id ${req.params.id}`);
    return res.send(student);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    let student = new Student(req.body);
    let result = validate(req.body);
    console.log(result);
    if (result.error)
      return res.status(400).send(result.error.details[0].message);
    result = await student.save();
    return res.send(result);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    let result = validate(req.body);
    if (result.error)
      return res.status(400).send(result.error.details[0].message);
    let student = await Student.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        isTopper: req.body.isTopper,
        phone: req.body.phone,
      },
      {
        new: true,
      }
    );
    if (!student)
      return res
        .status(404)
        .send(`There is no student with id ${req.params.id}`);
    return res.send(student);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let student = await Student.findByIdAndRemove(req.params.id);
    if (!student)
      return res
        .status(404)
        .send(`There is no student with id ${req.params.id}`);
    return res.send(student);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
});

module.exports = router;
