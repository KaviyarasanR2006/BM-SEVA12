const Report = require('../models/Report');

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
  const reports = await Report.find();
  res.json(reports);
});

exports.create = createHandler(async (req, res) => {
  const { title, content, date } = req.body;
  if (!title || !content || !date) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }
  const newReport = new Report({ title, content, date });
  await newReport.save();
  res.status(201).json(newReport);
});

exports.getById = createHandler(async (req, res) => {
  const { id } = req.params;
  const report = await Report.findById(id);
  if (!report) {
    return res.status(404).json({ message: 'Report not found' });
  }
  res.json(report);
});

exports.update = createHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content, date } = req.body;
  const report = await Report.findByIdAndUpdate(id, { title, content, date }, { new: true });
  if (!report) {
    return res.status(404).json({ message: 'Report not found' });
  }
  res.json(report);
});

exports.delete = createHandler(async (req, res) => {
  const { id } = req.params;
  const report = await Report.findByIdAndDelete(id);
  if (!report) {
    return res.status(404).json({ message: 'Report not found' });
  }
  res.json({ message: 'Report deleted successfully' });
});
