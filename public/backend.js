const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'evault-secret-key-2025',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 3600000 } // 1 hour
}));

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, JPG, and PNG are allowed.'));
    }
  }
});

// Helper functions
const getUsersFilePath = () => path.join(__dirname, 'data', 'users.json');
const getDocumentsFilePath = () => path.join(__dirname, 'data', 'documents.json');

const ensureDataDirectoryExists = () => {
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)){
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Create users.json if it doesn't exist
  const usersFilePath = getUsersFilePath();
  if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, JSON.stringify([]));
  }
  
  // Create documents.json if it doesn't exist
  const documentsFilePath = getDocumentsFilePath();
  if (!fs.existsSync(documentsFilePath)) {
    fs.writeFileSync(documentsFilePath, JSON.stringify([]));
  }
};

ensureDataDirectoryExists();

// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.status(401).json({ success: false, message: 'Authentication required' });
};

// Initialize some sample users if none exist
const initializeSampleUsers = async () => {
  const usersFilePath = getUsersFilePath();
  const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
  
  if (users.length === 0) {
    // Create some sample users
    const sampleUsers = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'admin',
        created: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'user',
        created: new Date().toISOString()
      }
    ];
    
    fs.writeFileSync(usersFilePath, JSON.stringify(sampleUsers, null, 2));
    console.log('Sample users created');
  }
};

initializeSampleUsers();

// Routes

// Register a new user
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    
    const usersFilePath = getUsersFilePath();
    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    
    // Check if user already exists
    if (users.some(user => user.email === email)) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role: 'user',
      created: new Date().toISOString()
    };
    
    users.push(newUser);
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    
    // Set session
    req.session.userId = newUser.id;
    
    res.status(201).json({ 
      success: true, 
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    
    const usersFilePath = getUsersFilePath();
    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    
    const user = users.find(user => user.email === email);
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Set session
    req.session.userId = user.id;
    
    res.json({ 
      success: true, 
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// Logout
app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Logout failed' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

// Get current user
app.get('/api/user', isAuthenticated, (req, res) => {
  try {
    const usersFilePath = getUsersFilePath();
    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    
    const user = users.find(user => user.id === req.session.userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ 
      success: true, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Upload a document
app.post('/api/documents/upload', isAuthenticated, upload.single('document'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    const filePath = req.file.path;
    const fileName = req.file.originalname;
    const fileBuffer = fs.readFileSync(filePath);
    
    // Generate document hash for verification
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    
    // Create document record
    const newDocument = {
      id: 'DOC-' + Date.now(),
      userId: req.session.userId,
      name: fileName,
      path: filePath,
      hash,
      size: req.file.size,
      mimeType: req.file.mimetype,
      uploadDate: new Date().toISOString(),
      verified: true
    };
    
    // Save document record
    const documentsFilePath = getDocumentsFilePath();
    const documents = JSON.parse(fs.readFileSync(documentsFilePath, 'utf8'));
    documents.push(newDocument);
    fs.writeFileSync(documentsFilePath, JSON.stringify(documents, null, 2));
    
    res.status(201).json({ 
      success: true, 
      message: 'Document uploaded successfully',
      document: {
        id: newDocument.id,
        name: newDocument.name,
        hash: newDocument.hash,
        uploadDate: newDocument.uploadDate
      }
    });
  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({ success: false, message: 'Server error during document upload' });
  }
});

// Verify a document
app.post('/api/documents/verify', upload.single('document'), (req, res) => {
  try {
    let documentId = req.body.documentId;
    let documentHash;
    
    if (req.file) {
      // If file is uploaded, calculate its hash
      const fileBuffer = fs.readFileSync(req.file.path);
      documentHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
      
      // Delete the uploaded file after processing
      fs.unlinkSync(req.file.path);
    } else if (!documentId) {
      return res.status(400).json({ success: false, message: 'Document ID or file is required' });
    }
    
    const documentsFilePath = getDocumentsFilePath();
    const documents = JSON.parse(fs.readFileSync(documentsFilePath, 'utf8'));
    
    let document;
    
    if (documentHash) {
      document = documents.find(doc => doc.hash === documentHash);
    } else {
      document = documents.find(doc => doc.id === documentId);
    }
    
    if (!document) {
      return res.json({ 
        success: true, 
        verified: false,
        message: 'Document cannot be verified'
      });
    }
    
    // Find user who uploaded the document
    const usersFilePath = getUsersFilePath();
    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    const user = users.find(user => user.id === document.userId);
    
    res.json({ 
      success: true, 
      verified: true,
      document: {
        id: document.id,
        name: document.name,
        uploadDate: document.uploadDate,
        issuer: user ? user.name : 'Unknown',
        transactionId: crypto.createHash('sha256').update(document.id).digest('hex').substring(0, 16)
      }
    });
  } catch (error) {
    console.error('Document verification error:', error);
    res.status(500).json({ success: false, message: 'Server error during document verification' });
  }
});

// Get user's documents
app.get('/api/documents', isAuthenticated, (req, res) => {
  try {
    const documentsFilePath = getDocumentsFilePath();
    const documents = JSON.parse(fs.readFileSync(documentsFilePath, 'utf8'));
    
    const userDocuments = documents.filter(doc => doc.userId === req.session.userId);
    
    res.json({ 
      success: true, 
      documents: userDocuments.map(doc => ({
        id: doc.id,
        name: doc.name,
        hash: doc.hash,
        size: doc.size,
        uploadDate: doc.uploadDate,
        verified: doc.verified
      }))
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete a document
app.delete('/api/documents/:id', isAuthenticated, (req, res) => {
  try {
    const documentId = req.params.id;
    const documentsFilePath = getDocumentsFilePath();
    const documents = JSON.parse(fs.readFileSync(documentsFilePath, 'utf8'));
    
    const documentIndex = documents.findIndex(doc => doc.id === documentId && doc.userId === req.session.userId);
    
    if (documentIndex === -1) {
      return res.status(404).json({ success: false, message: 'Document not found or not authorized' });
    }
    
    // Get the document to delete its file
    const document = documents[documentIndex];
    
    // Remove from file system if exists
    if (fs.existsSync(document.path)) {
      fs.unlinkSync(document.path);
    }
    
    // Remove from documents array
    documents.splice(documentIndex, 1);
    
    // Save updated documents
    fs.writeFileSync(documentsFilePath, JSON.stringify(documents, null, 2));
    
    res.json({ success: true, message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ success: false, message: 'Server error during document deletion' });
  }
});

// Get system statistics - for admins only
app.get('/api/stats', isAuthenticated, (req, res) => {
  try {
    // Check if user is admin
    const usersFilePath = getUsersFilePath();
    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    const currentUser = users.find(user => user.id === req.session.userId);
    
    if (!currentUser || currentUser.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    
    const documentsFilePath = getDocumentsFilePath();
    const documents = JSON.parse(fs.readFileSync(documentsFilePath, 'utf8'));
    
    // Calculate statistics
    const stats = {
      totalUsers: users.length,
      totalDocuments: documents.length,
      totalVerifications: Math.floor(documents.length * 1.5), // Just a mock value for demo
      storageUsed: documents.reduce((total, doc) => total + (doc.size || 0), 0),
      recentActivity: [
        {
          action: 'Document Upload',
          user: 'Jane Smith',
          timestamp: new Date(Date.now() - 3600000).toISOString()  // 1 hour ago
        },
        {
          action: 'Document Verification',
          user: 'John Doe',
          timestamp: new Date(Date.now() - 7200000).toISOString()  // 2 hours ago
        },
        {
          action: 'User Registration',
          user: 'Alex Johnson',
          timestamp: new Date(Date.now() - 86400000).toISOString()  // 1 day ago
        }
      ]
    };
    
    res.json({ success: true, stats });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});