const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Helper to adapt Express-style controller to native HTTP req/res
function createHandler(controllerFunc) {
  return async (req, res) => {
    // Create mock res object with status and json methods
    let statusCode = 200;
    const resWrapper = {
      status: (code) => {
        statusCode = code;
        return resWrapper;
      },
      json: (data) => {
        res.writeHead(statusCode, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        });
        res.end(JSON.stringify(data));
      },
      send: (data) => {
        res.writeHead(statusCode, {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin': '*',
        });
        res.end(data);
      }
    };

    // Call original controller function with adapted req and res
    try {
      await controllerFunc(req, resWrapper);
    } catch (error) {
      console.error('Controller error:', error);
      resWrapper.status(500).json({ message: 'Server error' });
    }
  };
}

exports.register = createHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    return res.status(400).json({ message: 'Username or email already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    email,
    passwordHash,
  });

  await newUser.save();

  return res.status(201).json({ message: 'User registered successfully' });
});

exports.login = createHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide username and password' });
  }

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  const token = jwt.sign(
    { userId: user._id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '1d' }
  );

  return res.json({ token, username: user.username, role: user.role });
});
