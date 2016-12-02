"use strict";

const UserData = require("../data").users;
const encryption = require("../utilities/encryption");
const passport = require("passport");

function loadRegisterPage(req, res) {
	res.render("auth/register");
}

function loadLoginPage(req, res) {
	res.render("auth/login");
}

function logoutUser(req, res) {
	req.logout();
	return res.redirect("/");
}

function registerUser(req, res) {
	const body = req.body;
	UserData
		.getByUsername(body.username)
		.then(foundUser => {
			if (!foundUser) {
				let salt = encryption.generateSalt();
				let hashPass = encryption.generateHashedPassword(salt, body.password);
				let newUserData = {
					username: body.username,
					firstName: body.firstName,
					lastName: body.lastName,
					hashPass: hashPass,
					salt: salt,
					phoneNumber: body.phoneNumber,
					email: body.email,
					avatar: body.avatar
				};

				UserData
					.create(newUserData)
					.then(() => res.redirect("/auth/login"))
					.catch(() => {
						res.status(500);
						res.send("Registration failed");
						res.end();
					});
			} else {
				res.status(409);
				res.render("auth/register", { user });
				res.end();
			}
		});
}

function loginUser(req, res, next) {
	let userModel = req.body;

	passport.authenticate("local", (err, userModel) => {
		if (err) {
			return next(err);
		}
		if (!userModel) {
			return res.render("auth/login");
		}
		req.login(userModel, error => {
			if (error) {
				return next(error);
			}
			return res.redirect("/");
		});
	})(req, res, next);
}

module.exports = { 
	loadRegisterPage, 
	loadLoginPage,
	logoutUser,
	registerUser,
	loginUser
};