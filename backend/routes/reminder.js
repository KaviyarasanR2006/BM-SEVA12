const reminderController = require('../controllers/reminderController');

async function handle(req, res) {
  const { method, pathname, body } = req;

  if (method === 'GET' && pathname === '/api/reminders') {
    return reminderController.getAll(req, res);
  } else if (method === 'POST' && pathname === '/api/reminders') {
    return reminderController.create(req, res);
  } else if (method === 'GET' && pathname.startsWith('/api/reminders/')) {
    const id = pathname.split('/')[3];
    req.params = { id };
    return reminderController.getById(req, res);
  } else if (method === 'PUT' && pathname.startsWith('/api/reminders/')) {
    const id = pathname.split('/')[3];
    req.params = { id };
    return reminderController.update(req, res);
  } else if (method === 'DELETE' && pathname.startsWith('/api/reminders/')) {
    const id = pathname.split('/')[3];
    req.params = { id };
    return reminderController.delete(req, res);
  } else {
    res.status(404).json({ message: 'Not Found' });
  }
}

module.exports = { handle };
