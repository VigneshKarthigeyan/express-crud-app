const express = require("express");
const router = express.Router();
const config=require('config');
// router.get("/", (req, res) => {
//   res.send("Vignesh Karthigeyan");
// });

router.get("/", (req, res) => {
  res.render("home", {
    title: config.get('name'),
    message: "Vignesh Karthigeyan",
  });
});

module.exports = router;
