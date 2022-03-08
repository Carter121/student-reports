const students = [
	{
		id: 1,
		"Raise Hand": 1,
		"Ask For Help": 2,
		date: "2022-2-23",
		comment: "Good",
	},
	{
		id: 2,
		"Raise Hand": 3,
		"Ask For Help": 4,
		date: "2022-2-24",
		comment: "No Comment",
	},
	{
		id: 3,
		"Raise Hand": 5,
		"Ask For Help": 6,
		date: "2022-2-25",
		comment: "No Comment",
	},
	{
		id: 4,
		"Raise Hand": 7,
		"Ask For Help": 8,
		"Do Work": 3,
		date: "2022-2-25",
		comment: "No Comment",
	},
	{
		id: 5,
		"Raise Hand": 9,
		"Ask For Help": 10,
		"Do Work": 11,
		"New One": 12,
		date: "2022-2-25",
		comment: "No Comment",
	},
];

let data = [];

/* console.log(Object.keys(students[0]).length); */

let newKey = [];
let newArr = [];

function getKeys() {
	for (let i = 0; i < students.length; i++) {
		for (let key in students[i]) {
			if (
				key == "id" ||
				key == "date" ||
				key.toLowerCase().includes("comment")
			) {
				continue;
			} else {
				newKey = key;
				const newValue = students[i][key];
				const amountOfKeys = Object.keys(students[i]).length;

				if (key == newKey) {
					newArr.push(newValue);
				}
				console.log(newArr);
			}
		}
	}
}

function checkKey(key) {
	if (key == newKey) {
		newArr.push(newValue);
	}
}
