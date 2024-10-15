const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const userController = require('../controllers/userController');

// Mock the models and bcrypt
jest.mock('../models');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('User Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      req.body = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({ id: 1, role: 'user' });
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashedPassword');
      jwt.sign.mockImplementation((payload, secret, options, callback) => {
        callback(null, 'token');
      });

      await userController.register(req, res);

      expect(User.create).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword'
      });
      expect(res.json).toHaveBeenCalledWith({ token: 'token' });
    });

    it('should return 400 if user already exists', async () => {
      req.body = {
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'password123'
      };

      User.findOne.mockResolvedValue({ id: 1 });

      await userController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'User already exists' });
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'password123'
      };

      User.findOne.mockResolvedValue({ id: 1, password: 'hashedPassword', role: 'user' });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockImplementation((payload, secret, options, callback) => {
        callback(null, 'token');
      });

      await userController.login(req, res);

      expect(res.json).toHaveBeenCalledWith({ token: 'token' });
    });

    it('should return 400 for invalid credentials', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      User.findOne.mockResolvedValue({ id: 1, password: 'hashedPassword' });
      bcrypt.compare.mockResolvedValue(false);

      await userController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });
  });
});