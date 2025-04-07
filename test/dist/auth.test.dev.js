"use strict";

var _globals = require("@jest/globals");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

_globals.jest.mock('../backend/middlewares/userAuthentication', function () {
  return {
    authenticateToken: function authenticateToken(req, res, next) {
      return next();
    } // mock that always passes

  };
});

var request = require('supertest');

var mongoose = require('mongoose');

var bcrypt = require('bcryptjs');

var session = require('express-session');

var _require = require('../backend/users/controllers/userController'),
    capitalizeEmail = _require.capitalizeEmail,
    capitalizeEachWord = _require.capitalizeEachWord;

var _require2 = require('../server'),
    app = _require2.app;

var User = require('../backend/users/models/user');

var redisClient = require('../redisClient');

var authentication = require('../backend/middlewares/userAuthentication');

_globals.jest.mock('../backend/users/models/user'); // Mock the User model


_globals.jest.mock('../backend/admin/models/admin'); // Mock the Admin model


_globals.jest.mock('../redisClient'); // Mock Redis client
// describe('utility Function Tests', () => {
//   it('capitalizeEmail should capitalize the first letter of email', () => {
//     expect(capitalizeEmail('test@example.com')).toBe('Test@example.com');
//     expect(capitalizeEmail('john.doe@email.com')).toBe('John.doe@email.com');
//   });
//   it('capitalizeEachWord should capitalize each word in a string', () => {
//     expect(capitalizeEachWord('john doe')).toBe('John Doe');
//     expect(capitalizeEachWord('hello world')).toBe('Hello World');
//   });
// });


(0, _globals.beforeEach)(function _callee() {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(User.deleteMany({}));

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
});
(0, _globals.afterAll)(function _callee2() {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(mongoose.connection.close());

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
});
(0, _globals.describe)('user Registration Tests', function () {
  (0, _globals.beforeEach)(function () {
    _globals.jest.clearAllMocks(); // Clear mock calls before each test

  });

  _globals.jest.setTimeout(20000);

  (0, _globals.it)('should register a new user successfully', function _callee3() {
    var hashedPassword, response;
    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return regeneratorRuntime.awrap(bcrypt.hash('password123', 10));

          case 2:
            hashedPassword = _context3.sent;
            User.findOne.mockResolvedValue(null); // Simulate email not existing

            _globals.jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword'); // Mock password hashing


            _globals.jest.spyOn(User.prototype, 'save').mockImplementation().mockResolvedValue({
              name: 'John Doe',
              email: 'John.doe@example.com',
              role: 'user',
              password: hashedPassword
            });

            redisClient.publish.mockResolvedValue(null); // Mock Redis publish

            _context3.next = 9;
            return regeneratorRuntime.awrap(request(app).post('/api/v1/users/register-user').send({
              name: 'john doe',
              email: 'john.doe@example.com',
              password: 'password123',
              role: 'user'
            }));

          case 9:
            response = _context3.sent;
            (0, _globals.expect)(response.status).toBe(201);
            (0, _globals.expect)(response.body).toHaveProperty('message', 'User registered successfully');

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    });
  });

  _globals.jest.setTimeout(20000);

  (0, _globals.it)('should return 401 if email already exists', function _callee4() {
    var response;
    return regeneratorRuntime.async(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            User.findOne.mockResolvedValue({
              email: 'john.doe@example.com'
            }); // Simulate email exists

            _context4.next = 3;
            return regeneratorRuntime.awrap(request(app).post('/api/v1/users/register-user').send({
              name: 'John Doe',
              email: 'john.doe@example.com',
              password: 'password123',
              role: 'user'
            }));

          case 3:
            response = _context4.sent;
            (0, _globals.expect)(response.status).toBe(401);
            (0, _globals.expect)(response.body).toHaveProperty('message', 'john.doe@example.com already exists');

          case 6:
          case "end":
            return _context4.stop();
        }
      }
    });
  });

  _globals.jest.setTimeout(20000);

  (0, _globals.it)('should return 500 on registration error', function _callee5() {
    var response;
    return regeneratorRuntime.async(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            User.findOne.mockRejectedValue(new Error('DB Error'));
            _context5.next = 3;
            return regeneratorRuntime.awrap(request(app).post('/api/v1/users/register-user').send({
              name: 'John Doe',
              email: 'john.doe@example.com',
              password: 'password123',
              role: 'user'
            }));

          case 3:
            response = _context5.sent;
            (0, _globals.expect)(response.status).toBe(500);
            (0, _globals.expect)(response.body).toHaveProperty('message', 'Error registering user');

          case 6:
          case "end":
            return _context5.stop();
        }
      }
    });
  });
});

_globals.jest.setTimeout(20000); // Testing logging in and user data update
// Mock token generation


_globals.jest.mock('../backend/middlewares/userAuthentication', function () {
  return {
    generateToken: _globals.jest.fn(function () {
      return 'mocked_token';
    })
  };
}); // Mock session middleware


_globals.jest.mock < _typeof(Promise.resolve().then(function () {
  return _interopRequireWildcard(require('express-session'));
})) > ('express-session', function () {
  return _globals.jest.fn(function (req, res, next) {
    return next();
  });
}); // ** Before All Tests **

(0, _globals.beforeAll)(function _callee6() {
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(mongoose.connect(process.env.DB_AUTHENTICATION, {
            useNewUrlParser: true,
            useUnifiedTopology: true
          }));

        case 2:
        case "end":
          return _context6.stop();
      }
    }
  });
}); // ** Before Each Test **

(0, _globals.beforeEach)(function _callee7() {
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _globals.jest.clearAllMocks();

          _context7.next = 3;
          return regeneratorRuntime.awrap(User.deleteMany({}));

        case 3:
        case "end":
          return _context7.stop();
      }
    }
  });
}); // ** After Each Test **

(0, _globals.afterEach)(function () {
  _globals.jest.restoreAllMocks();
}); // ** After All Tests **

(0, _globals.afterAll)(function _callee8() {
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return regeneratorRuntime.awrap(mongoose.connection.close());

        case 2:
        case "end":
          return _context8.stop();
      }
    }
  });
});
(0, _globals.describe)('auth Controller Tests', function () {
  (0, _globals.beforeAll)(function _callee9() {
    return regeneratorRuntime.async(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return regeneratorRuntime.awrap(mongoose.connect(process.env.DB_AUTHENTICATION, {
              useNewUrlParser: true,
              useUnifiedTopology: true
            }));

          case 2:
          case "end":
            return _context9.stop();
        }
      }
    });
  });
  (0, _globals.describe)('POST login-user', function () {
    (0, _globals.it)('should return 404 if user email does not exist', function _callee10() {
      var res;
      return regeneratorRuntime.async(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _globals.jest.spyOn(User, 'findOne').mockResolvedValue(null);

              _context10.next = 3;
              return regeneratorRuntime.awrap(request(app).post('/api/v1/users/login-user').send({
                email: 'nonexistent@example.com',
                password: 'password123'
              }));

            case 3:
              res = _context10.sent;
              (0, _globals.expect)(res.status).toBe(404);
              (0, _globals.expect)(res.body.message).toBe('Email does not exist');

            case 6:
            case "end":
              return _context10.stop();
          }
        }
      });
    });
    (0, _globals.it)('should return 402 if password is incorrect', function _callee11() {
      var mockUser, res;
      return regeneratorRuntime.async(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              mockUser = {
                _id: '123',
                email: 'test@example.com',
                password: 'hashedpassword'
              };

              _globals.jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);

              _globals.jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

              _context11.next = 5;
              return regeneratorRuntime.awrap(request(app).post('/api/v1/users/login-user').send({
                email: 'test@example.com',
                password: 'wrongpassword'
              }));

            case 5:
              res = _context11.sent;
              (0, _globals.expect)(res.status).toBe(402);
              (0, _globals.expect)(res.body.message).toBe('Incorrect password');

            case 8:
            case "end":
              return _context11.stop();
          }
        }
      });
    });
    (0, _globals.it)('should log in successfully and return a token', function _callee12() {
      var mockUser, res;
      return regeneratorRuntime.async(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _context12.next = 2;
              return regeneratorRuntime.awrap(bcrypt.hash('hashedpassword', 10));

            case 2:
              _context12.t0 = _context12.sent;
              _context12.t1 = new Date();
              _context12.t2 = _globals.jest.fn().mockResolvedValue(true);
              _context12.t3 = _globals.jest.fn().mockReturnValue({
                _id: 'someUserId',
                email: 'test@example.com',
                name: 'Test User',
                lastLogin: new Date()
              });
              mockUser = {
                _id: 'someUserId',
                email: 'test@example.com',
                name: 'Test User',
                password: _context12.t0,
                lastLogin: _context12.t1,
                save: _context12.t2,
                toObject: _context12.t3
              };

              _globals.jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);

              _globals.jest.spyOn(bcrypt, 'compare').mockResolvedValue(true); // Ensure password matches correctly


              _globals.jest.spyOn(mockUser, 'save').mockResolvedValue(mockUser);

              _context12.next = 12;
              return regeneratorRuntime.awrap(request(app).post('/api/v1/users/login-user').send({
                email: 'test@example.com',
                password: 'hashedpassword'
              }));

            case 12:
              res = _context12.sent;
              console.log("Response: ", res.body);
              console.log("Status Code:", res.status);
              (0, _globals.expect)(res.status).toBe(200);
              (0, _globals.expect)(res.body.message).toBe('Test User logged in successfully');
              (0, _globals.expect)(res.body.token).toBeDefined();

            case 18:
            case "end":
              return _context12.stop();
          }
        }
      });
    });
    (0, _globals.afterAll)(function _callee13() {
      return regeneratorRuntime.async(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              _context13.next = 2;
              return regeneratorRuntime.awrap(mongoose.connection.close());

            case 2:
            case "end":
              return _context13.stop();
          }
        }
      });
    });
  });
}); // test to update user data
// describe("PUT /api/v1/users/update-user-data", () => {
//   test("should login and modify user details", async () => {
//     const loginRes = await request(app)
//     .post("/api/v1/users/login-user")
//     .send({
//       email: "myemail@email.com",
//       password: "password",
//     });
//     expect(loginRes.status).toBe(200);
//     expect(loginRes.body.user).toHaveProperty("_id");
//     const userId = loginRes.body.user;
//     console.log(userId)
//     // const updateRes = await request(app).put("/api/v1/users/update-user-data").send({
//     //   userId,
//     //   name: "Updated Name",
//     //   role: "admin",
//     // });
//     // expect(updateRes.status).toBe(200);
//     // expect(updateRes.body.updatedUser.name).toBe("Updated Name");
//     // expect(updateRes.body.updatedUser.role).toBe("admin");
//   });
// });