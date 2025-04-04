"use strict";

var _globals = require("@jest/globals");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

_globals.jest.mock('../../', function () {
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
}); // describe('user Registration Tests', () => {
//   beforeEach(() => {
//     jest.clearAllMocks(); // Clear mock calls before each test
//   });
//   jest.setTimeout(20000);
//   it('should register a new user successfully', async () => {
//     const hashedPassword = await bcrypt.hash('password123', 10);
//     User.findOne.mockResolvedValue(null); // Simulate email not existing
//     jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword'); // Mock password hashing
//     jest.spyOn(User.prototype, 'save').mockImplementation().mockResolvedValue({
//       name: 'John Doe',
//       email: 'John.doe@example.com',
//       role: 'user',
//       password: hashedPassword
//     });
//     redisClient.publish.mockResolvedValue(null); // Mock Redis publish
//     const response = await request(app)
//       .post('/api/v1/users/register-user')
//       .send({
//         name: 'john doe',
//         email: 'john.doe@example.com',
//         password: 'password123',
//         role: 'user',
//       });
//     expect(response.status).toBe(201);
//     expect(response.body).toHaveProperty('message', 'User registered successfully');
//   });
//   jest.setTimeout(20000);
//   it('should return 401 if email already exists', async () => {
//     User.findOne.mockResolvedValue({ email: 'john.doe@example.com' }); // Simulate email exists
//     const response = await request(app)
//       .post('/api/v1/users/register-user')
//       .send({
//         name: 'John Doe',
//         email: 'john.doe@example.com',
//         password: 'password123',
//         role: 'user',
//       });
//     expect(response.status).toBe(401);
//     expect(response.body).toHaveProperty('message', 'john.doe@example.com already exists');
//   });
//   jest.setTimeout(20000);
//   it('should return 500 on registration error', async () => {
//     User.findOne.mockRejectedValue(new Error('DB Error'));
//     const response = await request(app)
//       .post('/api/v1/users/register-user')
//       .send({
//         name: 'John Doe',
//         email: 'john.doe@example.com',
//         password: 'password123',
//         role: 'user',
//       });
//     expect(response.status).toBe(500);
//     expect(response.body).toHaveProperty('message', 'Error registering user');
//   });
// });

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

(0, _globals.beforeAll)(function _callee3() {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(mongoose.connect(process.env.DB_AUTHENTICATION, {
            useNewUrlParser: true,
            useUnifiedTopology: true
          }));

        case 2:
        case "end":
          return _context3.stop();
      }
    }
  });
}); // ** Before Each Test **

(0, _globals.beforeEach)(function _callee4() {
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _globals.jest.clearAllMocks();

          _context4.next = 3;
          return regeneratorRuntime.awrap(User.deleteMany({}));

        case 3:
        case "end":
          return _context4.stop();
      }
    }
  });
}); // ** After Each Test **

(0, _globals.afterEach)(function () {
  _globals.jest.restoreAllMocks();
}); // ** After All Tests **

(0, _globals.afterAll)(function _callee5() {
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(mongoose.connection.close());

        case 2:
        case "end":
          return _context5.stop();
      }
    }
  });
}); // describe('auth Controller Tests', () => {
//   beforeAll(async () => {
//     await mongoose.connect(process.env.DB_AUTHENTICATION, { useNewUrlParser: true, useUnifiedTopology: true });
//   });
//   describe('POST login-user', () => {
//     it('should return 404 if user email does not exist', async () => {
//       jest.spyOn(User, 'findOne').mockResolvedValue(null);
//       const res = await request(app)
//         .post('/api/v1/users/login-user')
//         .send({ email: 'nonexistent@example.com', password: 'password123' });
//       expect(res.status).toBe(404);
//       expect(res.body.message).toBe('Email does not exist');
//     });
//     it('should return 402 if password is incorrect', async () => {
//       const mockUser = { _id: '123', email: 'test@example.com', password: 'hashedpassword' };
//       jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
//       jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
//       const res = await request(app)
//         .post('/api/v1/users/login-user')
//         .send({ email: 'test@example.com', password: 'wrongpassword' });
//       expect(res.status).toBe(402);
//       expect(res.body.message).toBe('Incorrect password');
//     });
//     it('should log in successfully and return a token', async () => {
//       const mockUser = {
//         _id: 'someUserId',
//         email: 'test@example.com',
//         name: 'Test User',
//         password: await bcrypt.hash('hashedpassword', 10),
//         lastLogin: new Date(),
//         save: jest.fn().mockResolvedValue(true), // Mock save function
//         toObject: jest.fn().mockReturnValue({
//           _id: 'someUserId',
//           email: 'test@example.com',
//           name: 'Test User',
//           lastLogin: new Date(),
//         }),
//       };
//       jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
//       jest.spyOn(bcrypt, 'compare').mockResolvedValue(true); // Ensure password matches correctly
//       jest.spyOn(mockUser, 'save').mockResolvedValue(mockUser);
//       const res = await request(app)
//         .post('/api/v1/users/login-user')
//         .send({ email: 'test@example.com', password: 'hashedpassword' });
//       console.log("Response: ", res.body);
//       console.log("Status Code:", res.status);
//       expect(res.status).toBe(200);
//       expect(res.body.message).toBe('Test User logged in successfully');
//       expect(res.body.token).toBeDefined();
//     }); 
//     afterAll(async () => {
//       await mongoose.connection.close(); // Close DB connection after tests
//     });
//   });
// });
// test to update user data

(0, _globals.describe)("PUT /api/v1/users/update-user-data", function () {
  (0, _globals.test)("should login and modify user details", function _callee6() {
    var loginRes, userId;
    return regeneratorRuntime.async(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return regeneratorRuntime.awrap(request(app).post("/api/v1/users/login-user").send({
              email: "myemail@email.com",
              password: "password"
            }));

          case 2:
            loginRes = _context6.sent;
            (0, _globals.expect)(loginRes.status).toBe(200);
            (0, _globals.expect)(loginRes.body.user).toHaveProperty("_id");
            userId = loginRes.body.user;
            console.log(userId); // const updateRes = await request(app).put("/api/v1/users/update-user-data").send({
            //   userId,
            //   name: "Updated Name",
            //   role: "admin",
            // });
            // expect(updateRes.status).toBe(200);
            // expect(updateRes.body.updatedUser.name).toBe("Updated Name");
            // expect(updateRes.body.updatedUser.role).toBe("admin");

          case 7:
          case "end":
            return _context6.stop();
        }
      }
    });
  });
});