const authController = require('../controllers/authController');

async function handle(req, res) {
  const { method, pathname, body } = req;

  if (method === 'POST' && pathname === '/api/auth/register') {
    return authController.register(req, res);
  } else if (method === 'POST' && pathname === '/api/auth/login') {
    return authController.login(req, res);
  } else {
    res.status(404).json({ message: 'Not Found' });
  }
}

module.exports = { handle };
