jest.mock('../backend/middlewares/userAuthentication', () => ({
  authenticateToken: (req, res, next) => next() // mock that always passes
}));

import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, jest, test } from '@jest/globals';

const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const { capitalizeEmail, capitalizeEachWord } = require('../backend/users/controllers/userController');
const { app } = require('../server');
const User = require('../backend/users/models/user');
const redisClient = require('../redisClient');
const authentication = require('../backend/middlewares/userAuthentication')

jest.mock('../backend/users/models/user'); // Mock the User model
jest.mock('../backend/admin/models/admin'); // Mock the Admin model
jest.mock('../redisClient'); // Mock Redis client

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

beforeEach(async () => {
  await User.deleteMany({}); // Clear test users before each test
});

afterAll(async () => {
  await mongoose.connection.close(); // Close DB connection after tests
});

describe('user Registration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  jest.setTimeout(20000);

  
  it('should register a new user successfully', async () => {
    
    const hashedPassword = await bcrypt.hash('password123', 10);
    User.findOne.mockResolvedValue(null); // Simulate email not existing
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword'); // Mock password hashing
    jest.spyOn(User.prototype, 'save').mockImplementation().mockResolvedValue({
      name: 'John Doe',
      email: 'John.doe@example.com',
      role: 'user',
      password: hashedPassword
    });
    redisClient.publish.mockResolvedValue(null); // Mock Redis publish

    const response = await request(app)
      .post('/api/v1/users/register-user')
      .send({
        name: 'john doe',
        email: 'john.doe@example.com',
        password: 'password123',
        role: 'user',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'User registered successfully');
  });

  jest.setTimeout(20000);

  it('should return 401 if email already exists', async () => {
    User.findOne.mockResolvedValue({ email: 'john.doe@example.com' }); // Simulate email exists

    const response = await request(app)
      .post('/api/v1/users/register-user')
      .send({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        role: 'user',
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'john.doe@example.com already exists');
  });

  jest.setTimeout(20000);

  it('should return 500 on registration error', async () => {
    User.findOne.mockRejectedValue(new Error('DB Error'));

    const response = await request(app)
      .post('/api/v1/users/register-user')
      .send({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        role: 'user',
      });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Error registering user');
  });
});

jest.setTimeout(20000);

// Testing logging in and user data update
// Mock token generation
jest.mock('../backend/middlewares/userAuthentication', () => ({
  generateToken: jest.fn(() => 'mocked_token'),
}));

// Mock session middleware
jest.mock < typeof import('express-session') > ('express-session', () => jest.fn((req, res, next) => next()));

// ** Before All Tests **
beforeAll(async () => {
  await mongoose.connect(process.env.DB_AUTHENTICATION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// ** Before Each Test **
beforeEach(async () => {
  jest.clearAllMocks();
  await User.deleteMany({});
});

// ** After Each Test **
afterEach(() => {
  jest.restoreAllMocks();
});

// ** After All Tests **
afterAll(async () => {
  await mongoose.connection.close();
});

describe('auth Controller Tests', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_AUTHENTICATION, { useNewUrlParser: true, useUnifiedTopology: true });
  });


  describe('POST login-user', () => {
    it('should return 404 if user email does not exist', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValue(null);

      const res = await request(app)
        .post('/api/v1/users/login-user')
        .send({ email: 'nonexistent@example.com', password: 'password123' });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Email does not exist');
    });

    it('should return 402 if password is incorrect', async () => {
      const mockUser = { _id: '123', email: 'test@example.com', password: 'hashedpassword' };
      jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      const res = await request(app)
        .post('/api/v1/users/login-user')
        .send({ email: 'test@example.com', password: 'wrongpassword' });

      expect(res.status).toBe(402);
      expect(res.body.message).toBe('Incorrect password');
    });

    it('should log in successfully and return a token', async () => {
      const mockUser = {
        _id: 'someUserId',
        email: 'test@example.com',
        name: 'Test User',
        password: await bcrypt.hash('hashedpassword', 10),
        lastLogin: new Date(),
        save: jest.fn().mockResolvedValue(true), // Mock save function
        toObject: jest.fn().mockReturnValue({
          _id: 'someUserId',
          email: 'test@example.com',
          name: 'Test User',
          lastLogin: new Date(),
        }),
      };

      jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true); // Ensure password matches correctly
      jest.spyOn(mockUser, 'save').mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/api/v1/users/login-user')
        .send({ email: 'test@example.com', password: 'hashedpassword' });

      console.log("Response: ", res.body);
      console.log("Status Code:", res.status);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Test User logged in successfully');
      expect(res.body.token).toBeDefined();
    }); 
    
    afterAll(async () => {
      await mongoose.connection.close(); // Close DB connection after tests
    });

  });

});


// test to update user data


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
