const biowasteController = require('../controllers/biowasteController');

async function handle(req, res) {
  const { method, pathname, body } = req;

  if (method === 'GET' && pathname === '/api/biowaste') {
    return biowasteController.getAll(req, res);
  } else if (method === 'POST' && pathname === '/api/biowaste') {
    return biowasteController.create(req, res);
  } else if (method === 'GET' && pathname.startsWith('/api/biowaste/')) {
    const id = pathname.split('/')[3];
    req.params = { id };
    return biowasteController.getById(req, res);
  } else if (method === 'PUT' && pathname.startsWith('/api/biowaste/')) {
    const id = pathname.split('/')[3];
    req.params = { id };
    return biowasteController.update(req, res);
  } else if (method === 'DELETE' && pathname.startsWith('/api/biowaste/')) {
    const id = pathname.split('/')[3];
    req.params = { id };
    return biowasteController.delete(req, res);
  } else {
    res.status(404).json({ message: 'Not Found' });
  }
}

module.exports = { handle };
