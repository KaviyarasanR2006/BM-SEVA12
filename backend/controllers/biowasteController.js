const BiowasteLog = require('../models/BiowasteLog');

function createHandler(controllerFunc) {
  return async (req, res) => {
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

    try {
      await controllerFunc(req, resWrapper);
    } catch (error) {
      console.error('Controller error:', error);
      resWrapper.status(500).json({ message: 'Server error' });
    }
  };
}

exports.getAll = createHandler(async (req, res) => {
  const logs = await BiowasteLog.find();
  res.json(logs);
});

exports.create = createHandler(async (req, res) => {
  const { description, quantity, date } = req.body;
  if (!description || !quantity || !date) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }
  const newLog = new BiowasteLog({ description, quantity, date });
  await newLog.save();
  res.status(201).json(newLog);
});

exports.getById = createHandler(async (req, res) => {
  const { id } = req.params;
  const log = await BiowasteLog.findById(id);
  if (!log) {
    return res.status(404).json({ message: 'Log not found' });
  }
  res.json(log);
});

exports.update = createHandler(async (req, res) => {
  const { id } = req.params;
  const { description, quantity, date } = req.body;
  const log = await BiowasteLog.findByIdAndUpdate(id, { description, quantity, date }, { new: true });
  if (!log) {
    return res.status(404).json({ message: 'Log not found' });
  }
  res.json(log);
});

exports.delete = createHandler(async (req, res) => {
  const { id } = req.params;
  const log = await BiowasteLog.findByIdAndDelete(id);
  if (!log) {
    return res.status(404).json({ message: 'Log not found' });
  }
  res.json({ message: 'Log deleted successfully' });
});
