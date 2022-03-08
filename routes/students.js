const express = require("express");
const { message } = require("statuses");
const router = express.Router();
const Student = require("../models/students");
const nodemailer = require("nodemailer");
const fetch = require("node-fetch");

//* Email Stuff
const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

//* Format Date
var format = function (input) {
	var pattern = /(\d{4})\-(\d{2})\-(\d{2})/;
	if (!input || !input.match(pattern)) {
		return null;
	}
	return input.replace(pattern, "$2/$3/$1");
};

async function getStudentName(id) {
	let output = "";
	await fetch(`https://${process.env.YOUR_URL}:3000/students/${id}`)
		.then((res) => res.json())
		.then((data) => (output = data.name));

	return output;
}

async function getTeacherName(id) {
	let output = "";
	await fetch(`https://${process.env.YOUR_URL}:3000/students/${id}`)
		.then((res) => res.json())
		.then((data) => (output = data.teacher));

	return output;
}

//* Prepare the email
async function prepareEmail(data, id) {
	let studentName = await getStudentName(id);
	let teacherName = await getTeacherName(id);

	let tempData = data;
	let email;
	let date;

	let total = 0;
	let tempKey = Object.keys(tempData);

	await getDateAndEmail();
	function getDateAndEmail() {
		for (let i = 0; i < tempKey.length; i++) {
			if (tempKey[i] == "email") {
				email = tempData["email"];
				delete tempData.email;
			}
			if (tempKey[i] == "date") {
				date = tempData["date"];
				delete tempData.date;
			}
		}
	}

	tempKey = Object.keys(tempData);

	for (let i = 0; i < tempKey.length; i++) {
		if (/comment/i.test(tempKey[i])) {
			continue;
		} else {
			total += parseInt(tempData[tempKey[i]]);
			tempData.total = total;
		}
	}
	date = format(date);

	//* Send the email
	sendEmail(email, date, tempData, studentName, teacherName);
}

function sendEmail(sendToEmail, date, data, studentName, teacherName) {
	let cards = "";

	let tempKey = Object.keys(data);
	for (let i = 0; i < tempKey.length; i++) {
		cards += `
			<table class="card" role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-radius: 6px; border-collapse: separate !important; width: 100%; overflow: hidden; margin: 0; padding: 0; border: 1px solid #e2e8f0;" bgcolor="#ffffff">
				<tbody style="margin: 0; padding: 0;">
				<tr style="margin: 0; padding: 0;">
					<td style="line-height: 24px; font-size: 16px; width: 100%; margin: 0; padding: 0;" align="left" bgcolor="#ffffff">
					<table class="card-body" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin: 0; padding: 0;">
					<tbody style="margin: 0; padding: 0;">
					<tr style="margin: 0; padding: 0;">
						<td style="line-height: 24px; font-size: 16px; width: 100%; margin: 0; padding: 20px;" align="left">
						<p class="text-center h2" style="line-height: 38.4px; font-size: 32px; font-weight: 500; vertical-align: baseline; width: 100%; margin: 0; padding: 0;" align="center">${
							tempKey[i].charAt(0).toUpperCase() + tempKey[i].slice(1)
						}</p>
						<table class="s-2 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin: 0; padding: 0;" width="100%">
							<tbody style="margin: 0; padding: 0;">
							<tr style="margin: 0; padding: 0;">
								<td style="line-height: 8px; font-size: 8px; width: 100%; height: 8px; margin: 0; padding: 0;" align="left" width="100%" height="8">
								&#160;
								</td>
							</tr>
							</tbody>
						</table>
						<p class="text-center h5" style="line-height: 24px; font-size: 20px; font-weight: 500; vertical-align: baseline; width: 100%; margin: 0; padding: 0;" align="center">${
							data[tempKey[i]]
						}</p>
						</td>
					</tr>
					</tbody>
					</table>
					</td>
				</tr>
				</tbody>
				</table>
				<table class="s-4 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin: 0; padding: 0;" width="100%">
				<tbody style="margin: 0; padding: 0;">
				<tr style="margin: 0; padding: 0;">
					<td style="line-height: 16px; font-size: 16px; width: 100%; height: 16px; margin: 0; padding: 0;" align="left" width="100%" height="16">
					&#160;
					</td>
				</tr>
				</tbody>
			</table>
		`;
	}

	let body = `
	<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/REC-html40/loose.dtd">
	<html style="margin: 0; padding: 0;">
	<head>
		<!-- Compiled with Bootstrap Email version: 1.1.2 --><meta http-equiv="x-ua-compatible" content="ie=edge">
		<meta name="x-apple-disable-message-reformatting">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<style type="text/css">
		body,table,td{font-family:Helvetica,Arial,sans-serif !important}.ExternalClass{width:100%}.ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div{line-height:150%}a{text-decoration:none}*{color:inherit}a[x-apple-data-detectors],u+#body a,#MessageViewBody a{color:inherit;text-decoration:none;font-size:inherit;font-family:inherit;font-weight:inherit;line-height:inherit}img{-ms-interpolation-mode:bicubic}table:not([class^=s-]){font-family:Helvetica,Arial,sans-serif;mso-table-lspace:0pt;mso-table-rspace:0pt;border-spacing:0px;border-collapse:collapse}table:not([class^=s-]) td{border-spacing:0px;border-collapse:collapse}@media screen and (max-width: 600px){.d-inline-block{display:inline-block !important}.w-full,.w-full>tbody>tr>td{width:100% !important}*[class*=s-lg-]>tbody>tr>td{font-size:0 !important;line-height:0 !important;height:0 !important}.s-2>tbody>tr>td{font-size:8px !important;line-height:8px !important;height:8px !important}.s-4>tbody>tr>td{font-size:16px !important;line-height:16px !important;height:16px !important}.s-5>tbody>tr>td{font-size:20px !important;line-height:20px !important;height:20px !important}.s-10>tbody>tr>td{font-size:40px !important;line-height:40px !important;height:40px !important}}
		</style>
	</head>
	<body class="bg-light" style="outline: 0; width: 100%; min-width: 100%; height: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: Helvetica, Arial, sans-serif; line-height: 24px; font-weight: normal; font-size: 16px; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; color: #000000; margin: 0; padding: 0; border-width: 0;" bgcolor="#f7fafc">
		<table class="bg-light body" valign="top" role="presentation" border="0" cellpadding="0" cellspacing="0" style="outline: 0; width: 100%; min-width: 100%; height: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: Helvetica, Arial, sans-serif; line-height: 24px; font-weight: normal; font-size: 16px; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; color: #000000; margin: 0; padding: 0; border-width: 0;" bgcolor="#f7fafc">
		<tbody style="margin: 0; padding: 0;">
			<tr style="margin: 0; padding: 0;">
			<td valign="top" style="line-height: 24px; font-size: 16px; margin: 0; padding: 0;" align="left" bgcolor="#f7fafc">
				<table class="container" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin: 0; padding: 0;">
				<tbody style="margin: 0; padding: 0;">
					<tr style="margin: 0; padding: 0;">
					<td align="center" style="line-height: 24px; font-size: 16px; margin: 0; padding: 0 16px;">
						<!--[if (gte mso 9)|(IE)]>
						<table align="center" role="presentation">
							<tbody>
							<tr>
								<td width="600">
						<![endif]-->
						<table align="center" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; margin: 0 auto; padding: 0;">
						<tbody style="margin: 0; padding: 0;">
							<tr style="margin: 0; padding: 0;">
							<td style="line-height: 24px; font-size: 16px; margin: 0; padding: 0;" align="left">
								<table class="s-10 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin: 0; padding: 0;" width="100%">
								<tbody style="margin: 0; padding: 0;">
									<tr style="margin: 0; padding: 0;">
									<td style="line-height: 40px; font-size: 40px; width: 100%; height: 40px; margin: 0; padding: 0;" align="left" width="100%" height="40">
										&#160;
									</td>
									</tr>
								</tbody>
								</table>
								<table class="card" role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-radius: 6px; border-collapse: separate !important; width: 100%; overflow: hidden; margin: 0; padding: 0; border: 1px solid #e2e8f0;" bgcolor="#ffffff">
								<tbody style="margin: 0; padding: 0;">
									<tr style="margin: 0; padding: 0;">
									<td style="line-height: 24px; font-size: 16px; width: 100%; margin: 0; padding: 0;" align="left" bgcolor="#ffffff">
										<table class="card-body" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin: 0; padding: 0;">
										<tbody style="margin: 0; padding: 0;">
											<tr style="margin: 0; padding: 0;">
											<td style="line-height: 24px; font-size: 16px; width: 100%; margin: 0; padding: 20px;" align="left">
												<h1 class="h3  text-center" style="font-weight: 500; vertical-align: baseline; font-size: 28px; line-height: 33.6px; margin: 0; padding: 0;" align="center">${studentName}</h1>
												<p class="text-center" style="font-weight: 500; vertical-align: baseline; font-size: 14px; line-height: 33.6px; margin: 0; padding: 0;" align="center">Please contact ${teacherName} if you have any questions</p> 
												<table class="s-2 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin: 0; padding: 0;" width="100%">
												<tbody style="margin: 0; padding: 0;">
													<tr style="margin: 0; padding: 0;">
													<td style="line-height: 8px; font-size: 8px; width: 100%; height: 8px; margin: 0; padding: 0;" align="left" width="100%" height="8">
														&#160;
													</td>
													</tr>
												</tbody>
												</table>
												<table class="s-5 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin: 0; padding: 0;" width="100%">
												<tbody style="margin: 0; padding: 0;">
													<tr style="margin: 0; padding: 0;">
													<td style="line-height: 20px; font-size: 20px; width: 100%; height: 20px; margin: 0; padding: 0;" align="left" width="100%" height="20">
														&#160;
													</td>
													</tr>
												</tbody>
												</table>
												<table class="hr" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin: 0; padding: 0;">
												<tbody style="margin: 0; padding: 0;">
													<tr style="margin: 0; padding: 0;">
													<td style="line-height: 24px; font-size: 16px; border-top-width: 1px; border-top-color: #e2e8f0; border-top-style: solid; height: 1px; width: 100%; margin: 0; padding: 0;" align="left">
													</td>
													</tr>
												</tbody>
												</table>
												<table class="s-5 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin: 0; padding: 0;" width="100%">
												<tbody style="margin: 0; padding: 0;">
													<tr style="margin: 0; padding: 0;">
													<td style="line-height: 20px; font-size: 20px; width: 100%; height: 20px; margin: 0; padding: 0;" align="left" width="100%" height="20">
														&#160;
													</td>
													</tr>
												</tbody>
												</table>
												<table class="ax-center" role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto; padding: 0;">
												<tbody style="margin: 0; padding: 0;">
													<tr style="margin: 0; padding: 0;">
													<td style="line-height: 24px; font-size: 16px; margin: 0; padding: 0;" align="left">
														<div class="d-inline-block" style="display: inline-block; margin: 0; padding: 0;">
														<!-- START OF CARD -->
														${cards}
														<!-- END OF CARD -->
														</div>
													</td>
													</tr>
												</tbody>
												</table>
											</td>
											</tr>
										</tbody>
										</table>
									</td>
									</tr>
								</tbody>
								</table>
								<table class="s-10 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin: 0; padding: 0;" width="100%">
								<tbody style="margin: 0; padding: 0;">
									<tr style="margin: 0; padding: 0;">
									<td style="line-height: 40px; font-size: 40px; width: 100%; height: 40px; margin: 0; padding: 0;" align="left" width="100%" height="40">
										&#160;
									</td>
									</tr>
								</tbody>
								</table>
							</td>
							</tr>
						</tbody>
						</table>
						<!--[if (gte mso 9)|(IE)]>
						</td>
					</tr>
					</tbody>
				</table>
						<![endif]-->
					</td>
					</tr>
				</tbody>
				</table>
			</td>
			</tr>
		</tbody>
		</table>
	</body>
	</html>

	`;
	transporter.sendMail(
		{
			from: process.env.EMAIL_USER,
			to: sendToEmail,
			subject: `${date} Report`,
			html: body,
		},
		function (error, info) {
			if (error) {
				console.log(error);
			} else {
				console.log("Email sent: " + info.response);
			}
		}
	);
}

//* Getting all students
router.get("/", async (req, res) => {
	try {
		const students = await Student.find();
		res.json(students);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

//* Getting one student
router.get("/:id", getStudent, (req, res) => {
	res.send(res.student);
});

//* Creating one student
router.post("/", async (req, res) => {
	const student = new Student({
		name: req.body.name,
		parentEmail: req.body.parentEmail,
		teacher: req.body.teacher,
	});
	try {
		const newStudent = await student.save();
		res.status(201).json(newStudent);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

//* Updating one student
router.patch("/:id", getStudent, async (req, res) => {
	if (req.body.name != null) {
		res.student.name = req.body.name;
	}
	if (req.body.parentEmail != null) {
		res.student.parentEmail = req.body.parentEmail;
	}
	if (req.body.teacher != null) {
		res.student.teacher = req.body.teacher;
	}
	if (req.body.goals != null) {
		res.student.goals = req.body.goals;
	}
	if (req.body.scores != null) {
		// console.log(req.body.scores.pop());
		res.student.scores = req.body.scores;
		prepareEmail(req.body.scores.pop(), req.params.id);
	}
	try {
		const updatedStudent = await res.student.save();
		res.json(updatedStudent);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

//* Deleting one student
router.delete("/:id", getStudent, async (req, res) => {
	try {
		await res.student.remove();
		res.json({ message: "Student Deleted" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

async function getStudent(req, res, next) {
	let student;
	try {
		student = await Student.findById(req.params.id);
		if (student == null) {
			return res.status(404).json({ message: "Can not find student" });
		}
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}

	res.student = student;
	next();
}

module.exports = router;
