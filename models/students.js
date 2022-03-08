const mongoose = require("mongoose");
const { object } = require("webidl-conversions");
const { any } = require("webidl-conversions");

const subSchema = new mongoose.Schema({
	type: {
		type: String,
	},
	name: {
		type: String,
	},
});

// const scoreSchema = new mongoose.Schema({
// 	date: {
// 		type: String,
// 	},

// });

const studentSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	parentEmail: {
		type: String,
		required: true,
	},
	teacher: {
		type: String,
		required: true,
	},
	goals: [subSchema],
	scores: [],
});

module.exports = mongoose.model("Student", studentSchema);
