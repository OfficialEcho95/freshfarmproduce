"use strict";

var _globals = require("@jest/globals");

var _supertest = _interopRequireDefault(require("supertest"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _server = _interopRequireDefault(require("../server"));

var _user = _interopRequireDefault(require("../backend/users/models/user"));

var _redisClient = _interopRequireDefault(require("../redisClient"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable jest/prefer-expect-assertions */

/* eslint-disable jest/no-confusing-set-timeout */

/* eslint-disable jest/no-hooks */

/* eslint-disable jest/require-top-level-describe */

/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable jest/no-untyped-mock-factory */
// Mock the necessary modules
_globals.jest.mock('../backend/middlewares/userAuthentication', function () {
  return {
    authenticateToken: function authenticateToken(req, res, next) {
      return next();
    } // Mock token middleware

  };
});

_globals.jest.mock('../backend/users/models/user'); // Mock the User model


_globals.jest.mock('../redisClient'); // Mock Redis client
// Set up Jest timeouts


_globals.jest.setTimeout(20000); // ** Before All Tests **


(0, _globals.beforeAll)(function _callee() {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(_mongoose["default"].connect(process.env.DB_AUTHENTICATION, {
            useNewUrlParser: true,
            useUnifiedTopology: true
          }));

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
}); // ** Before Each Test **

(0, _globals.beforeEach)(function _callee2() {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _globals.jest.clearAllMocks(); // Clear mock calls before each test


          _context2.next = 3;
          return regeneratorRuntime.awrap(_user["default"].deleteMany({}));

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // ** After All Tests **

(0, _globals.afterAll)(function _callee3() {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(_mongoose["default"].connection.close());

        case 2:
        case "end":
          return _context3.stop();
      }
    }
  });
}); // User Registration Tests

(0, _globals.describe)('User Registration Tests', function () {
  (0, _globals.it)('should register a new user successfully', function _callee4() {
    var hashedPassword, response;
    return regeneratorRuntime.async(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return regeneratorRuntime.awrap(_bcryptjs["default"].hash('password123', 10));

          case 2:
            hashedPassword = _context4.sent;

            // Mocking the behavior of the User model
            _user["default"].findOne.mockResolvedValue(null); // Simulate email not existing


            _globals.jest.spyOn(_bcryptjs["default"], 'hash').mockResolvedValue('hashedpassword'); // Mock password hashing


            _globals.jest.spyOn(_user["default"].prototype, 'save').mockResolvedValue({
              name: 'John Doe',
              email: 'john.doe@example.com',
              role: 'user',
              password: hashedPassword
            });

            _redisClient["default"].publish.mockResolvedValue(null); // Mock Redis publish


            _context4.next = 9;
            return regeneratorRuntime.awrap((0, _supertest["default"])(_server["default"]).post('/api/v1/users/register-user').send({
              name: 'john doe',
              email: 'john.doe@example.com',
              password: 'password123',
              role: 'user'
            }));

          case 9:
            response = _context4.sent;
            (0, _globals.expect)(response.status).toBe(201);
            (0, _globals.expect)(response.body).toHaveProperty('message', 'User registered successfully');

          case 12:
          case "end":
            return _context4.stop();
        }
      }
    });
  });
  (0, _globals.it)('should return 401 if email already exists', function _callee5() {
    var response;
    return regeneratorRuntime.async(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _user["default"].findOne.mockResolvedValue({
              email: 'john.doe@example.com'
            }); // Simulate email exists


            _context5.next = 3;
            return regeneratorRuntime.awrap((0, _supertest["default"])(_server["default"]).post('/api/v1/users/register-user').send({
              name: 'John Doe',
              email: 'john.doe@example.com',
              password: 'password123',
              role: 'user'
            }));

          case 3:
            response = _context5.sent;
            (0, _globals.expect)(response.status).toBe(401);
            (0, _globals.expect)(response.body).toHaveProperty('message', 'john.doe@example.com already exists');

          case 6:
          case "end":
            return _context5.stop();
        }
      }
    });
  });
  (0, _globals.it)('should return 500 on registration error', function _callee6() {
    var response;
    return regeneratorRuntime.async(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _user["default"].findOne.mockRejectedValue(new Error('DB Error'));

            _context6.next = 3;
            return regeneratorRuntime.awrap((0, _supertest["default"])(_server["default"]).post('/api/v1/users/register-user').send({
              name: 'John Doe',
              email: 'john.doe@example.com',
              password: 'password123',
              role: 'user'
            }));

          case 3:
            response = _context6.sent;
            (0, _globals.expect)(response.status).toBe(500);
            (0, _globals.expect)(response.body).toHaveProperty('message', 'Error registering user');

          case 6:
          case "end":
            return _context6.stop();
        }
      }
    });
  });
}); // User Login Tests

(0, _globals.describe)('user Login Tests', function () {
  (0, _globals.it)('should return 404 if user email does not exist', function _callee7() {
    var response;
    return regeneratorRuntime.async(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _globals.jest.spyOn(_user["default"], 'findOne').mockResolvedValue(null); // Simulate email not found


            _context7.next = 3;
            return regeneratorRuntime.awrap((0, _supertest["default"])(_server["default"]).post('/api/v1/users/login-user').send({
              email: 'nonexistent@example.com',
              password: 'password123'
            }));

          case 3:
            response = _context7.sent;
            (0, _globals.expect)(response.status).toBe(404);
            (0, _globals.expect)(response.body.message).toBe('Email does not exist');

          case 6:
          case "end":
            return _context7.stop();
        }
      }
    });
  });
  (0, _globals.it)('should return 402 if password is incorrect', function _callee8() {
    var mockUser, response;
    return regeneratorRuntime.async(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            mockUser = {
              _id: '123',
              email: 'test@example.com',
              password: 'hashedpassword'
            };

            _globals.jest.spyOn(_user["default"], 'findOne').mockResolvedValue(mockUser);

            _globals.jest.spyOn(_bcryptjs["default"], 'compare').mockResolvedValue(false); // Simulate incorrect password


            _context8.next = 5;
            return regeneratorRuntime.awrap((0, _supertest["default"])(_server["default"]).post('/api/v1/users/login-user').send({
              email: 'test@example.com',
              password: 'wrongpassword'
            }));

          case 5:
            response = _context8.sent;
            (0, _globals.expect)(response.status).toBe(402);
            (0, _globals.expect)(response.body.message).toBe('Incorrect password');

          case 8:
          case "end":
            return _context8.stop();
        }
      }
    });
  });
  (0, _globals.it)('should log in successfully and return a token', function _callee9() {
    var mockUser, response;
    return regeneratorRuntime.async(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return regeneratorRuntime.awrap(_bcryptjs["default"].hash('hashedpassword', 10));

          case 2:
            _context9.t0 = _context9.sent;
            _context9.t1 = new Date();
            _context9.t2 = _globals.jest.fn().mockResolvedValue(true);
            _context9.t3 = _globals.jest.fn().mockReturnValue({
              _id: 'someUserId',
              email: 'test@example.com',
              name: 'Test User',
              lastLogin: new Date()
            });
            mockUser = {
              _id: 'someUserId',
              email: 'test@example.com',
              name: 'Test User',
              password: _context9.t0,
              lastLogin: _context9.t1,
              save: _context9.t2,
              toObject: _context9.t3
            };

            _globals.jest.spyOn(_user["default"], 'findOne').mockResolvedValue(mockUser);

            _globals.jest.spyOn(_bcryptjs["default"], 'compare').mockResolvedValue(true); // Ensure password matches


            _context9.next = 11;
            return regeneratorRuntime.awrap((0, _supertest["default"])(_server["default"]).post('/api/v1/users/login-user').send({
              email: 'test@example.com',
              password: mockUser.password
            }));

          case 11:
            response = _context9.sent;
            (0, _globals.expect)(response.status).toBe(200);
            (0, _globals.expect)(response.body.message).toBe('Test User logged in successfully');
            (0, _globals.expect)(response.body.token).toBeDefined();

          case 15:
          case "end":
            return _context9.stop();
        }
      }
    });
  });
});