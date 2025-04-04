"use strict";

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/* eslint-disable consistent-return */
var bcrypt = require('bcrypt');

var _require = require('../../middlewares/userAuthentication'),
    generateToken = _require.generateToken;

var User = require('../models/user');

var Admin = require('../../admin/models/admin');

var redisClient = require('../../../redisClient'); // Helper function to capitalize the first letter of an email


function capitalizeEmail(email) {
  return email.charAt(0).toUpperCase() + email.slice(1);
} // Helper function to capitalize the first letter of each word in a string


function capitalizeEachWord(str) {
  return str.split(' ') // Split the string into words
  .map(function (word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }) // Capitalize each word
  .join(' '); // Join the words back into a single string
} // Function to register new users


var registerUser = function registerUser(req, res) {
  var _req$body, name, email, password, role, emailExists, hashedPassword, newUser, newAdmin;

  return regeneratorRuntime.async(function registerUser$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, name = _req$body.name, email = _req$body.email, password = _req$body.password, role = _req$body.role;
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 4:
          emailExists = _context.sent;

          if (!emailExists) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", res.status(401).json({
            message: "".concat(email, " already exists")
          }));

        case 7:
          _context.next = 9;
          return regeneratorRuntime.awrap(bcrypt.hash(password, 10));

        case 9:
          hashedPassword = _context.sent;
          newUser = new User({
            name: capitalizeEachWord(name),
            email: capitalizeEmail(email),
            password: hashedPassword,
            role: role
          });
          _context.next = 13;
          return regeneratorRuntime.awrap(newUser.save());

        case 13:
          _context.next = 15;
          return regeneratorRuntime.awrap(redisClient.publish('user-registered', JSON.stringify({
            email: newUser.email,
            subject: 'Welcome!',
            text: 'Thank you for registering!'
          })));

        case 15:
          if (!(newUser.role === 'admin')) {
            _context.next = 19;
            break;
          }

          newAdmin = new Admin({
            name: name,
            password: password,
            role: role,
            email: email
          });
          _context.next = 19;
          return regeneratorRuntime.awrap(newAdmin.save());

        case 19:
          return _context.abrupt("return", res.status(201).json({
            message: 'User registered successfully',
            newUser: newUser
          }));

        case 22:
          _context.prev = 22;
          _context.t0 = _context["catch"](1);
          res.status(500).json({
            message: 'Error registering user'
          });

        case 25:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 22]]);
};

var loginUser = function loginUser(req, res) {
  var _req$body2, email, password, user, comparePassword, token, _user$toObject, _, userWithoutPassword;

  return regeneratorRuntime.async(function loginUser$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;
          _context2.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 4:
          user = _context2.sent;

          if (user) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: 'Email does not exist'
          }));

        case 7:
          _context2.next = 9;
          return regeneratorRuntime.awrap(bcrypt.compare(password, user.password));

        case 9:
          comparePassword = _context2.sent;

          if (comparePassword) {
            _context2.next = 12;
            break;
          }

          return _context2.abrupt("return", res.status(402).json({
            message: 'Incorrect password'
          }));

        case 12:
          // Update lastLogin to current time
          user.lastLogin = new Date();
          _context2.next = 15;
          return regeneratorRuntime.awrap(user.save());

        case 15:
          token = generateToken(user._id);
          req.session.userId = user._id.toString();
          req.session.token = token;
          _context2.next = 20;
          return regeneratorRuntime.awrap(req.session.save());

        case 20:
          // Create a new object without the password
          _user$toObject = user.toObject(), _ = _user$toObject.password, userWithoutPassword = _objectWithoutProperties(_user$toObject, ["password"]); // Converting Mongoose document to plain object and exclude password

          return _context2.abrupt("return", res.status(200).json({
            message: "".concat(user.name, " logged in successfully"),
            user: userWithoutPassword,
            token: token
          }));

        case 24:
          _context2.prev = 24;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            message: 'Error encountered logging in'
          });

        case 27:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 24]]);
}; // function to update user data


var updateUserData = function updateUserData(req, res) {
  var _req$body3, data, password, userId, update, hashedPassword, updatedUser;

  return regeneratorRuntime.async(function updateUserData$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _req$body3 = req.body, data = _req$body3.data, password = _req$body3.password;
          userId = req.session.userId;

          if (!(!data && !password)) {
            _context3.next = 5;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            message: 'No data provided'
          }));

        case 5:
          console.log(req.session);
          update = {};

          if (!password) {
            _context3.next = 12;
            break;
          }

          _context3.next = 10;
          return regeneratorRuntime.awrap(bcrypt.hash(password, 10));

        case 10:
          hashedPassword = _context3.sent;
          update.password = hashedPassword;

        case 12:
          // `data` is an object with other user fields to update
          Object.assign(update, data);
          _context3.next = 15;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(userId, update, {
            "new": true
          }));

        case 15:
          updatedUser = _context3.sent;

          if (updatedUser) {
            _context3.next = 18;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: 'User not found'
          }));

        case 18:
          res.status(200).json({
            message: 'User data updated successfully',
            updatedUser: updatedUser
          });
          _context3.next = 24;
          break;

        case 21:
          _context3.prev = 21;
          _context3.t0 = _context3["catch"](0);
          res.status(500).json({
            message: 'Internal server error',
            error: _context3.t0.message
          });

        case 24:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 21]]);
}; // route to delete user account


var deleteUserAccount = function deleteUserAccount(req, res) {
  var email, userId, user;
  return regeneratorRuntime.async(function deleteUserAccount$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          email = req.params.email;
          userId = req.session.userId;

          if (userId) {
            _context4.next = 5;
            break;
          }

          return _context4.abrupt("return", res.status(401).json({
            message: 'User not logged in'
          }));

        case 5:
          _context4.next = 7;
          return regeneratorRuntime.awrap(User.findOneAndDelete({
            email: email
          }));

        case 7:
          user = _context4.sent;

          if (user) {
            _context4.next = 10;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: 'User with that email does not exist'
          }));

        case 10:
          res.status(200).json({
            message: 'Account deleted successfully'
          });
          _context4.next = 16;
          break;

        case 13:
          _context4.prev = 13;
          _context4.t0 = _context4["catch"](0);
          res.status(500).json({
            message: 'Error deleting account',
            error: _context4.t0.message
          });

        case 16:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 13]]);
}; // function to update user dspa// function to logout user


var logoutUser = function logoutUser(req, res) {
  return regeneratorRuntime.async(function logoutUser$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          if (req.session.userId) {
            req.session.destroy(function (err) {
              if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({
                  message: 'Error logging out.'
                });
              }

              res.status(200).json({
                message: 'Logged out successfully.'
              });
            });
          } else {
            res.status(400).json({
              message: 'No active session to log out.'
            });
          }

        case 1:
        case "end":
          return _context5.stop();
      }
    }
  });
};

var checkSession = function checkSession(req, res) {
  var userId, user;
  return regeneratorRuntime.async(function checkSession$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          userId = req.session.userId;

          if (userId) {
            _context6.next = 4;
            break;
          }

          return _context6.abrupt("return", res.status(401).json({
            valid: false,
            message: 'Invalid session'
          }));

        case 4:
          _context6.next = 6;
          return regeneratorRuntime.awrap(User.findById(userId));

        case 6:
          user = _context6.sent;

          if (user) {
            _context6.next = 9;
            break;
          }

          return _context6.abrupt("return", res.status(401).json({
            valid: false,
            message: 'User not found'
          }));

        case 9:
          // Optional display of more user details which might be needed in the backend
          res.status(200).json({
            valid: true,
            userId: user._id,
            role: user.role
          });
          _context6.next = 16;
          break;

        case 12:
          _context6.prev = 12;
          _context6.t0 = _context6["catch"](0);
          console.error('Error checking session:', _context6.t0);
          res.status(500).json({
            valid: false,
            message: 'Internal server error'
          });

        case 16:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

module.exports = {
  registerUser: registerUser,
  loginUser: loginUser,
  checkSession: checkSession,
  logoutUser: logoutUser,
  updateUserData: updateUserData,
  deleteUserAccount: deleteUserAccount,
  capitalizeEachWord: capitalizeEachWord,
  capitalizeEmail: capitalizeEmail
};