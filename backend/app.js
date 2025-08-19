// ------------------------ IMPORTS ------------------------ //
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Student = require('./models/Student');
const LectureRequest = require('./models/LectureRequest'); 
const Admin = require('./models/Admin');
const Lecture = require('./models/AddLecture');
const ClassAttendance = require('./models/ClassAttendance');
const connectTOdb = require('./config/connect');

// ------------------------ APP INIT ------------------------ //
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// connect DB
connectTOdb();

// ------------------------ FILE UPLOAD SETUP ------------------------ //
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ------------------------ AUTH MIDDLEWARE ------------------------ //
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.admin = decoded;
    next();
  });
};

// ------------------------ ROUTES ------------------------ //

// ========================== LECTURE REQUEST ROUTES ========================== //

// Student submits a lecture request
app.post('/api/lecture-requests', async (req, res) => {
  try {
    const { studentRollNumber, type, lectureTitle, lectureDate, description } = req.body;

    if (!studentRollNumber || !lectureTitle || !lectureDate || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newRequest = new LectureRequest({
      studentRollNumber,
      type,
      lectureTitle,
      lectureDate,
      description,
    });

    await newRequest.save();
    res.status(201).json({ message: 'Lecture request submitted successfully', request: newRequest });
  } catch (error) {
    console.error('Error submitting lecture request:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin gets all lecture requests (protected)
app.get('/api/lecture-requests', verifyToken, async (req, res) => {
  try {
    const requests = await LectureRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('Error fetching lecture requests:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin approves a lecture request (protected)
app.put('/api/lecture-requests/:id/approve', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const updatedRequest = await LectureRequest.findByIdAndUpdate(
      id,
      { status: 'approved', adminComments: req.body.adminComments || '' },
      { new: true }
    );

    if (!updatedRequest) return res.status(404).json({ message: 'Lecture request not found' });

    res.json({ message: 'Lecture request approved', request: updatedRequest });
  } catch (error) {
    console.error('Error approving lecture request:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin rejects a lecture request (protected)
app.put('/api/lecture-requests/:id/reject', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const updatedRequest = await LectureRequest.findByIdAndUpdate(
      id,
      { status: 'rejected', adminComments: req.body.adminComments || '' },
      { new: true }
    );

    if (!updatedRequest) return res.status(404).json({ message: 'Lecture request not found' });

    res.json({ message: 'Lecture request rejected', request: updatedRequest });
  } catch (error) {
    console.error('Error rejecting lecture request:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ========================== LECTURE CRUD ROUTES ========================== //

// CREATE Lecture with file upload + date handling
app.post('/api/lectures', upload.fields([
  { name: 'images', maxCount: 1 },
  { name: 'banner', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      teacher,
      venue,
      class: className,
      time,
      strength,
      resourcePerson,
      company,
      location,
      designation,
      topic,
      date
    } = req.body;

    const newLecture = new Lecture({
      teacher,
      venue,
      class: className,
      time,
      strength,
      resourcePerson,
      company,
      location,
      designation,
      topic,
      date: date ? new Date(date) : undefined,
      images: req.files['images']?.[0]?.filename || '',
      banner: req.files['banner']?.[0]?.filename || '',
    });

    await newLecture.save();
    res.status(201).json({ message: 'Lecture saved successfully', lecture: newLecture });
  } catch (error) {
    console.error('Error saving lecture:', error);
    res.status(500).json({ message: 'Error saving lecture', error: error.message });
  }
});

// GET all Lectures with attendance flag
app.get('/api/lectures', async (req, res) => {
  try {
    const lectures = await Lecture.find();

    const lecturesWithAttendance = await Promise.all(
      lectures.map(async (lec) => {
        const attendance = await ClassAttendance.findOne({ lectureId: lec._id });
        return { ...lec.toObject(), attendanceMarked: !!attendance };
      })
    );

    res.json(lecturesWithAttendance);
  } catch (error) {
    console.error('Error fetching lectures:', error);
    res.status(500).json({ message: 'Error fetching lectures', error: error.message });
  }
});

// GET single Lecture by ID
app.get('/api/lectures/:id', async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);
    if (!lecture) return res.status(404).json({ message: 'Lecture not found' });
    res.json(lecture);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching lecture', error: err.message });
  }
});

// UPDATE Lecture (text + images)
app.put('/api/lectures/:id', upload.fields([
  { name: 'banner', maxCount: 1 },
  { name: 'images', maxCount: 1 }
]), async (req, res) => {
  try {
    const updates = { ...req.body };

    if (updates.date) updates.date = new Date(updates.date);

    if (req.files?.banner?.[0]) updates.banner = req.files.banner[0].filename;
    if (req.files?.images?.[0]) updates.images = req.files.images[0].filename;

    const updatedLecture = await Lecture.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updatedLecture) return res.status(404).json({ message: 'Lecture not found' });

    res.json({ message: 'Lecture updated successfully', lecture: updatedLecture });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: 'Failed to update lecture', error: err.message });
  }
});

// DELETE Lecture
app.delete('/api/lectures/:id', async (req, res) => {
  try {
    const deletedLecture = await Lecture.findByIdAndDelete(req.params.id);
    if (!deletedLecture) return res.status(404).json({ message: 'Lecture not found' });
    res.json({ message: 'Lecture deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete lecture', error: error.message });
  }
});

// ========================== CLASS ROUTES ========================== //

// GET distinct Classes
app.get('/api/classes', async (req, res) => {
  try {
    const { excludeAttendedForLecture } = req.query;

    if (excludeAttendedForLecture) {
      const lecture = await Lecture.findById(excludeAttendedForLecture);
      if (!lecture) return res.status(404).json({ message: 'Lecture not found' });

      const attendanceRecord = await ClassAttendance.findOne({ lectureId: excludeAttendedForLecture });
      const attendedClasses = attendanceRecord ? attendanceRecord.attendedClasses : [];

      if (!attendedClasses.includes(lecture.class)) {
        return res.json([{ _id: lecture._id, name: lecture.class }]);
      } else {
        return res.json([]);
      }
    }

    const classNames = await Lecture.distinct('class');
    const classes = await Promise.all(
      classNames.map(async (cls) => {
        const lecture = await Lecture.findOne({ class: cls });
        return { _id: lecture._id.toString(), name: cls };
      })
    );

    res.json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// POST mark Attendance
app.post('/api/class-attendance/mark', async (req, res) => {
  try {
    const { lectureId, attendedClasses, date } = req.body;
    if (!lectureId || !attendedClasses || !Array.isArray(attendedClasses)) {
      return res.status(400).json({ message: 'lectureId and attendedClasses array are required' });
    }

    const attendanceRecord = new ClassAttendance({
      lectureId,
      attendedClasses,
      date: date ? new Date(date) : new Date(),
    });

    await attendanceRecord.save();
    res.status(201).json({ message: 'Attendance recorded successfully', attendanceRecord });
  } catch (error) {
    console.error('Error saving attendance:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// ========================== ADMIN ROUTES ========================== //

// Register Admin
app.post('/api/admin/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      email,
      passwordHash: hashedPassword
    });

    await newAdmin.save();
    res.status(201).json({ message: "Admin registered successfully", admin: { id: newAdmin._id, email: newAdmin.email } });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Login Admin
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (!existingAdmin) return res.status(404).json({ message: "Admin not found" });

    const isPasswordValid = await bcrypt.compare(password, existingAdmin.passwordHash);
    if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: existingAdmin._id, email: existingAdmin.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Protected Route
app.get('/api/admin/protected', verifyToken, (req, res) => {
  res.json({ message: "Protected admin route ✅", admin: req.admin });
});

// Test Route
app.get('/api/admin/test', (req, res) => {
  res.json({ message: "Admin route working fine ✅" });
});

// ========================== STUDENT ROUTES ========================== //

// Student Login/Register
app.post('/api/student/login', async (req, res) => {
  try {
    const { rollNumber, name } = req.body;

    if (!rollNumber || !name) {
      return res.status(400).json({ message: "Roll number and name are required" });
    }

    let student = await Student.findOne({ rollNumber });

    if (!student) {
      student = new Student({ rollNumber, name });
      await student.save();
    }

    res.status(200).json({
      message: "Login successful",
      student: {
        id: student._id,
        rollNumber: student.rollNumber,
        name: student.name
      }
    });
  } catch (err) {
    console.error("Student login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ------------------------ SERVER ------------------------ //
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
