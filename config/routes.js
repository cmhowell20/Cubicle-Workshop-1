
const CubeModels = require('../models/cubeModels');
const Accessory = require('../models/Accessory');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


module.exports = (app) => {
	// TODO..
	app.get("/", async function (req, res) {
		await CubeModels.find(function (err, cubes){
			if (err) return console.error(err);
			console.log(cubes);
		res.render("index", {cubes, Title: "CBreezy Cubes"});
		});
		
	});

	app.get("/about", function (req, res) {
		res.render("about");
	});

	app.get("/register", function (req, res) {
		res.render("register");
	});

	app.post("/register", function (req, res) {
		console.log('reg body', req.body)
		bcrypt.hash(req.body.password, 8, function(err, hash) {
			// Store hash in your password DB.
		let tempuser = new User({username: req.body.username, password: hash})
		console.log(tempuser);
		tempuser.save()
	res.redirect("/login");
});

	app.get("/login", function (req, res) {
	res.render("login");
	});

	app.post("/login", async function (req, res) {
	console.log(req.body);
	await User.findOne(
		{ username: req.body.username },
		function (err, user) {
			console.log("User found!!", user);
			bcrypt.compare(
				req.body.password,
				user.password,
				function (err, result) {
					console.log("The password result is", result);
				});
			const token = jwt.sign({ id: user._id }, "Big Secret", {
				expiresIn: "2d",
			});
			console.log(token);
			res.cookie("token", token);
		});
	res.redirect("/");
});


	app.get("/create", function (req, res) {
		res.render("create");
	});

	app.post("/create", function (req, res) {
		console.log(req.body);
		const newCube = new CubeModels(req.body);
		newCube.save(function (err, newCube){
			console.log("New Cube was Saved");
		});
		res.redirect(301, "/");

	});

	app.get("/details/:id", async function (req, res) {
		
		await CubeModels.findById(req.params.id).then((CubeModels) =>{
			console.log(CubeModels);
			res.render('details',{CubeModels});
		});
	//	res.send(`<h1> Details id is ${req.params.id} </h1>`);
	});

	app.get("/createAccessory", function (req, res) {
		res.render("createAccessory");
		//res.send(`<h1> Create Accessory ${req.params.id} </h1>`);
	});

	app.post("/createAccessory", function (req, res) {
		const newAccessory = new Accessory(req.body);
		newAccessory.save(function (err, newCube) {
			console.log("A new accessory has been saved");
		});
		res.redirect(301, "/");
	});

	app.get("/attachAccessory", function (req, res) {
		res.render("attachAccessory");
	});

	
//(`<h1> Accessory ID ${req.params.id} </h1>`)
	app.get("/*", (req, res) => {
		res.render("404");
	});
