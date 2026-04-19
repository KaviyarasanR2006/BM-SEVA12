const BiomedicalWastePickupRequest = require('../models/BiomedicalWastePickupRequest');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

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

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jaybethpragathees@gmail.com', // hardcoded sender email as requested
    pass: '74uf9nbbpv'  // hardcoded password as requested
  }
});

exports.create = createHandler(async (req, res) => {
  const {
    name,
    contactNumber,
    address,
    descriptionOfWaste,
    preferredPickupDate,
    location,
  } = req.body;

  if (!name || !contactNumber || !address || !descriptionOfWaste || !preferredPickupDate) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  // Handle image file if uploaded (assuming middleware like multer is used)
  let imageFilename = null;
  if (req.file) {
    imageFilename = req.file.filename;
  }

  const newRequest = new BiomedicalWastePickupRequest({
    name,
    contactNumber,
    address,
    descriptionOfWaste,
    preferredPickupDate,
    image: imageFilename,
    location: location ? {
      latitude: location.latitude,
      longitude: location.longitude
    } : undefined
  });

  await newRequest.save();

  // Prepare email content
  let emailHtml = `
    <h2>New Biomedical Waste Pickup Request</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Contact Number:</strong> ${contactNumber}</p>
    <p><strong>Address:</strong> ${address}</p>
    <p><strong>Description of Waste:</strong> ${descriptionOfWaste}</p>
    <p><strong>Preferred Pickup Date:</strong> ${new Date(preferredPickupDate).toLocaleDateString()}</p>
  `;

  if (location) {
    emailHtml += `
      <p><strong>Location:</strong> Latitude: ${location.latitude}, Longitude: ${location.longitude}</p>
    `;
  }

  if (imageFilename) {
    const imagePath = path.join(__dirname, '..', 'uploads', imageFilename);
    emailHtml += `<p><strong>Image:</strong></p><img src="cid:biowasteimage"/>`;

    // Send mail with attachment
    try {
      await transporter.sendMail({
        from: '"Biomedical Waste Pickup" <jaybethpragathees@gmail.com>', // sender address hardcoded
        to: 'm.karthik8765@gmail.com', // recipient email updated as requested
        subject: 'New Biomedical Waste Pickup Request',
        html: emailHtml,
        attachments: [{
          filename: imageFilename,
          path: imagePath,
          cid: 'biowasteimage' // same cid value as in the html img src
        }]
      });
    } catch (error) {
      console.error('Error sending email with attachment:', error);
    }
  } else {
    // Send mail without attachment
    try {
      await transporter.sendMail({
        from: '"Biomedical Waste Pickup" <jaybethpragathees@gmail.com>', // sender address hardcoded
        to: 'm.karthik8765@gmail.com', // recipient email updated as requested
        subject: 'New Biomedical Waste Pickup Request',
        html: emailHtml
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  res.status(201).json(newRequest);
});
