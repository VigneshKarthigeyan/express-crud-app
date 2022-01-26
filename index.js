const express = require("express");
const mongoose = require("mongoose");
const morgan=require('morgan');
const debug = require("debug")("app:start");
const logger = require("./middleware/check");
const home = require("./routes/home");
const courses = require("./routes/courses");

const app = express();
mongoose.connect("mongodb://localhost/CourseDB")
    .then(()=>console.log("Mongodb connected successfully.."))
    .catch(error=>console.log(error.message));

app.set("view engine", "pug");

app.use(express.json());
app.use(logger);
if(app.get('env')==='development'){
    app.use(morgan('tiny'));
}

app.use("/", home);
app.use("/api/courses", courses);

const port = process.env.PORT || 3000;
debug("App has finely started...");
app.listen(port, () => console.log(`Listening in port ${port}...`));
