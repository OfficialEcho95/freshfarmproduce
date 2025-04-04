import { expect, test } from '@jest/globals';

const { capitalizeEachWord, capitalizeEmail } = require('../backend/users/controllers/userController');

test('should capitalize email', () => {
  expect(capitalizeEmail('test@email.com')).toBe('Test@email.com');
});

test('should capitalize each word in a string', () => {
  expect(capitalizeEachWord('john doe')).toBe('John Doe');
});
