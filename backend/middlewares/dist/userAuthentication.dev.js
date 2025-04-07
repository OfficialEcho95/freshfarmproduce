"use strict";

var jwt = require('jsonwebtoken');

var Admin = require('../admin/models/admin');

var UserFarmer = require('../users/models/user');

var generateToken = function generateToken(userId) {
  return jwt.sign({
    userId: userId
  }, process.env.AUTH_KEY, {
    expiresIn: '5H'
  });
}; // middleware to authenticate user


var authenticateToken = function authenticateToken(req, res, next) {
  var authHeader = req.headers.authorization;
  var token = req.session.token || authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized - missing token'
    });
  }

  try {
    var user = jwt.verify(token, process.env.AUTH_KEY);
    console.log(user);

    if (req.session.userId !== user.userId) {
      return res.status(401).json({
        error: 'Unauthorized - invalid user'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Unauthorized - token expired'
      });
    }

    return res.status(401).json({
      error: 'Unauthorized - invalid token'
    });
  }
}; // middleware to authenticate admin


var adminAuthenticateToken = function adminAuthenticateToken(req, res, next) {
  var authHeader = req.headers.authorization;
  var token = req.session.token || authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized - missing token'
    });
  }

  try {
    var user = jwt.verify(token, process.env.AUTH_KEY);

    if (req.session.adminId !== user.userId) {
      return res.status(401).json({
        error: 'Unauthorized - invalid user'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Unauthorized - token expired'
      });
    }

    return res.status(401).json({
      error: 'Unauthorized - invalid token'
    });
  }
}; // middleware for admin access


var adminAccess = function adminAccess(req, res, next) {
  var userId, user;
  return regeneratorRuntime.async(function adminAccess$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          userId = req.user.userId;
          _context.next = 3;
          return regeneratorRuntime.awrap(Admin.findById(userId));

        case 3:
          user = _context.sent;
          req.user = user;

          if (!(!user || user.role !== 'admin')) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", res.status(403).json({
            message: 'Access forbidden - admin only'
          }));

        case 7:
          return _context.abrupt("return", next());

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
};
/* middleware to give admin or only  farmer access to view his
completed orders
*/


var authorizeFarmerOrAdmin = function authorizeFarmerOrAdmin(req, res, next) {
  var user, farmerId, dbUser;
  return regeneratorRuntime.async(function authorizeFarmerOrAdmin$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          user = req.user;
          farmerId = req.params.farmerId;
          _context2.next = 5;
          return regeneratorRuntime.awrap(UserFarmer.findById(user.userId));

        case 5:
          dbUser = _context2.sent;

          if (dbUser) {
            _context2.next = 8;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: 'User not found.'
          }));

        case 8:
          if (!(dbUser.role === 'admin' || dbUser._id.toString() === farmerId)) {
            _context2.next = 12;
            break;
          }

          next();
          _context2.next = 13;
          break;

        case 12:
          return _context2.abrupt("return", res.status(403).json({
            message: 'Access denied.'
          }));

        case 13:
          _context2.next = 19;
          break;

        case 15:
          _context2.prev = 15;
          _context2.t0 = _context2["catch"](0);
          console.error('Authorization error:', _context2.t0);
          res.status(500).json({
            message: 'Server error'
          });

        case 19:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

module.exports = {
  authenticateToken: authenticateToken,
  adminAuthenticateToken: adminAuthenticateToken,
  generateToken: generateToken,
  adminAccess: adminAccess,
  authorizeFarmerOrAdmin: authorizeFarmerOrAdmin
};