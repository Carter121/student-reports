require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
app.use(cors());

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

app.use(express.json());

const studentsRouter = require("./routes/students");
app.use("/students", studentsRouter);

https
	.createServer(
		{
			key: fs.readFileSync("server.key"),
			cert: fs.readFileSync("server.cert"),
		},
		app
	)
	.listen(3000, function () {
		console.log(
			"Example app listening on port 3000! Go to https://localhost:3000/"
		);
	});
