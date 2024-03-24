const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cors = require('cors'); 

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err)); 

const studentSchema = new mongoose.Schema({
    name: String,
    email: String,
    dob: Date,
    mathsMark: Number,
    physicsMark: Number,
    chemistryMark: Number
});

const Student = mongoose.model('Student', studentSchema,'submit');

// Express middleware
app.use(express.json());
app.use(cors()); // Enable CORS

// API endpoints
app.post('/api/submit', async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();

        
        const { mathsMark, physicsMark, chemistryMark } = req.body;
        const cutoff = (mathsMark + physicsMark + chemistryMark) / 3;

        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'your_email@gmail.com',
                pass: 'your_password'
            }
        });

        const mailOptions = {
            from: 'your_email@gmail.com',
            to: req.body.email,
            subject: 'Cutoff Marks Notification',
            text: `Dear ${req.body.name},\n\nYour marks in Mathematics: ${mathsMark}, Physics: ${physicsMark}, Chemistry: ${chemistryMark}.\n\nYour cutoff marks: ${cutoff}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Email sending error:', error); 
            } else {
                console.log('Email sent:', info.response);
            }
        });

        res.status(201).send(student);
    } catch (err) {
        console.error('Error saving data:', err); 
        res.status(400).send(err);
    }
});


app.listen(5000, () => {
    console.log(`Server is running on port ${5000}`);
});
