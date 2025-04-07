/* eslint-disable jest/prefer-expect-assertions */
/* eslint-disable jest/no-confusing-set-timeout */
/* eslint-disable jest/no-hooks */
/* eslint-disable jest/require-top-level-describe */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jest/no-untyped-mock-factory */
import { afterAll, beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { app } from '../index'; // Ensure this path is correct
import User from '../backend/users/models/user';
import redisClient from '../redisClient';

// Mock the necessary modules
jest.mock('../backend/middlewares/userAuthentication', () => ({
  authenticateToken: (req, res, next) => next() // Mock token middleware
}));

jest.mock('../backend/users/models/user'); // Mock the User model
jest.mock('../redisClient'); // Mock Redis client

// Set up Jest timeouts
jest.setTimeout(20000);

// ** Before All Tests **
beforeAll(async () => {
  await mongoose.connect(process.env.DB_AUTHENTICATION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// ** Before Each Test **
beforeEach(async () => {
  jest.clearAllMocks(); // Clear mock calls before each test
  await User.deleteMany({}); // Clear test users before each test
});

// ** After All Tests **
afterAll(async () => {
  await mongoose.connection.close(); // Close DB connection after tests
});

// User Registration Tests
describe('User Registration Tests', () => {
  it('should register a new user successfully', async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Mocking the behavior of the User model
    User.findOne.mockResolvedValue(null); // Simulate email not existing
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword'); // Mock password hashing
    jest.spyOn(User.prototype, 'save').mockResolvedValue({
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'user',
      password: hashedPassword,
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

// User Login Tests
describe('user Login Tests', () => {
  it('should return 404 if user email does not exist', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue(null); // Simulate email not found

    const response = await request(app)
      .post('/api/v1/users/login-user')
      .send({ email: 'nonexistent@example.com', password: 'password123' });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Email does not exist');
  });

  it('should return 402 if password is incorrect', async () => {
    const mockUser = { _id: '123', email: 'test@example.com', password: 'hashedpassword' };
    jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false); // Simulate incorrect password

    const response = await request(app)
      .post('/api/v1/users/login-user')
      .send({ email: 'test@example.com', password: 'wrongpassword' });

    expect(response.status).toBe(402);
    expect(response.body.message).toBe('Incorrect password');
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
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true); // Ensure password matches

    const response = await request(app)
      .post('/api/v1/users/login-user')
      .send({ email: 'test@example.com', password: 'hashedpassword' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Test User logged in successfully');
    expect(response.body.token).toBeDefined();
  });
});
