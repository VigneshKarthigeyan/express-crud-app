const express = require("express");
const { Course } = require("../models/courses");
const { Student } = require("../models/students");
const { Enrollment, validate } = require("../models/enrollments");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const enrollments = await Enrollment.find();
    res.send(enrollments);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    let enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment)
      return res
        .status(404)
        .send(`There is no enrollment with id ${req.params.id}`);
    return res.send(enrollment);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    let result = validate(req.body);
    console.log(result);
    if (result.error)
      return res.status(400).send(result.error.details[0].message);

    let student = await Student.findById(req.body.studentId);
    if (!student)
      return res
        .status(404)
        .send(`There is no student with id ${req.body.studentId}`);

    let course = await Course.findById(req.body.courseId);
    if (!course)
      return res
        .status(404)
        .send(`There is no course with id ${req.body.courseId}`);

    if (!course.isPublished)
      return res
        .status(404)
        .send(`The course with id ${req.body.courseId} is not published yet`);
    console.log(student);
    console.log(course);

    let enrollmentdate = new Date();
    let validity = new Date(
      enrollmentdate.getTime() + 365 * 24 * 60 * 60 * 1000
    );
    let enrollment = new Enrollment({
      enrolledDate: enrollmentdate.getTime(),
      validityEndDate: validity.getTime(),
      price: course.price,
      student: {
        _id: req.body.studentId,
        name: student.name,
        phone: student.phone,
      },
      course: {
        _id: req.body.courseId,
        name: course.name,
        author: course.author,
      },
    });
    console.log("Enrollment", enrollment);
    course.noOfEnrollments+=1;
    result=await course.save();
    result = await enrollment.save();
    return res.send(result);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    let enrollment = await enrollment.findById(req.params.id);
    if (!enrollment)
      return res
        .status(404)
        .send(`There is no enrollment with id ${req.params.id}`);
    let result = validate(req.body);
    console.log(result);
    if (result.error)
      return res.status(400).send(result.error.details[0].message);

    let student = await Student.findById(req.body.studentId);
    if (!student)
      return res
        .status(404)
        .send(`There is no student with id ${req.body.studentId}`);

    let course = await Course.findById(req.body.courseId);
    if (!course)
      return res
        .status(404)
        .send(`There is no course with id ${req.body.courseId}`);

    console.log(student);
    console.log(course);

    let enrolleddate = enrollment.enrolledDate;
    let validity = enrollment.validityEndDate;
    enrollment.set({
      enrolledDate: enrolleddate,
      validityEndDate: validity,
      price: course.price,
      student: {
        _id: req.body.studentId,
        name: student.name,
        phone: student.phone,
      },
      course: {
        _id: req.body.courseId,
        name: course.name,
        author: course.author,
      },
    });
    result = await enrollment.save();
    return res.send(result);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let enrollment = await Enrollment.findByIdAndRemove(req.params.id);
    if (!enrollment)
      return res
        .status(404)
        .send(`There is no enrollment with id ${req.params.id}`);
    let course = await Course.findById(enrollment.course._id);
    course.noOfEnrollments-=1;
    let result=await course.save();
    console.log(result);
    return res.send(enrollment);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
});

module.exports = router;
