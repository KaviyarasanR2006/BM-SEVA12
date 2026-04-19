const Reminder = require('../models/Reminder');

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
  const reminders = await Reminder.find();
  res.json(reminders);
});

exports.create = createHandler(async (req, res) => {
  const { title, description, date } = req.body;
  if (!title || !description || !date) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }
  const newReminder = new Reminder({ title, description, date });
  await newReminder.save();
  res.status(201).json(newReminder);
});

exports.getById = createHandler(async (req, res) => {
  const { id } = req.params;
  const reminder = await Reminder.findById(id);
  if (!reminder) {
    return res.status(404).json({ message: 'Reminder not found' });
  }
  res.json(reminder);
});

exports.update = createHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, date } = req.body;
  const reminder = await Reminder.findByIdAndUpdate(id, { title, description, date }, { new: true });
  if (!reminder) {
    return res.status(404).json({ message: 'Reminder not found' });
  }
  res.json(reminder);
});

exports.delete = createHandler(async (req, res) => {
  const { id } = req.params;
  const reminder = await Reminder.findByIdAndDelete(id);
  if (!reminder) {
    return res.status(404).json({ message: 'Reminder not found' });
  }
  res.json({ message: 'Reminder deleted successfully' });
});
