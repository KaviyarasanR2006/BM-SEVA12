const reportController = require('../controllers/reportController');

async function handle(req, res) {
  const { method, pathname, body } = req;

  if (method === 'GET' && pathname === '/api/reports') {
    return reportController.getAll(req, res);
  } else if (method === 'POST' && pathname === '/api/reports') {
    return reportController.create(req, res);
  } else if (method === 'GET' && pathname.startsWith('/api/reports/')) {
    const id = pathname.split('/')[3];
    req.params = { id };
    return reportController.getById(req, res);
  } else if (method === 'PUT' && pathname.startsWith('/api/reports/')) {
    const id = pathname.split('/')[3];
    req.params = { id };
    return reportController.update(req, res);
  } else if (method === 'DELETE' && pathname.startsWith('/api/reports/')) {
    const id = pathname.split('/')[3];
    req.params = { id };
    return reportController.delete(req, res);
  } else {
    res.status(404).json({ message: 'Not Found' });
  }
}

module.exports = { handle };
