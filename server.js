import jsonServer from 'json-server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

const JWT_SECRET = 'your_jwt_secret_key'; 

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});

function createToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    console.log('JWT verify error:', e.message);
    return null;
  }
}


server.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const users = router.db.get('users').filter({ email }).value();

  if (users.length === 0) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const user = users[0];
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const { password: pwd, otp, ...userWithoutPassword } = user;

  const token = createToken({ id: user.id, email: user.email, role: user.role });

  res.json({ user: userWithoutPassword, token });
});

server.post('/signup', async (req, res) => {
  const db = router.db;
  const userData = { ...req.body };

  const existingUser = db.get('users').find({ email: userData.email }).value();
  if (existingUser) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  delete userData.id;

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const id = Date.now().toString();

  const newUser = { id, ...userData, password: hashedPassword };

  db.get('users').push(newUser).write();

  const { password, otp, ...safeUser } = newUser;
  console.log("userData after fix", newUser);

  const token = createToken({ id: safeUser.id, email: safeUser.email, role: safeUser.role });
  console.log("token", token);

  res.status(201).json({ user: safeUser, token });
});



server.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = router.db.get('users').find({ id: decoded.id }).value();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password, otp, ...userWithoutPassword } = user;

    res.json(userWithoutPassword);
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
});

server.post('/submit-answers', (req, res) => {
  const { answers, userId } = req.body;
  const db = router.db;

  if (!answers || typeof answers !== 'object') {
    return res.status(400).json({ message: 'Invalid answers format' });
  }

  const submission = {
    id: Date.now().toString(),
    userId: userId || null,
    answers,
    submittedAt: new Date().toISOString()
  };

  db.get('submissions').push(submission).write();

  res.status(201).json({ message: 'Answers submitted successfully', submission });
});

server.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const db = router.db;
  const user = db.get('users').find({ email }).value();

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (user.otp !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  db.get('users')
    .find({ email })
    .assign({ password: hashedPassword, otp: '' })
    .write();

  res.json({ message: 'Password reset successfully' });
});
server.get('/questions', (req, res) => {
  const questions = router.db.get('questions').value();

  if (!questions) {
    return res.status(404).json({ message: 'No questions found' });
  }

  res.json(questions);
});
server.post('/add-department', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ 
      status: 'error', 
      message: '⛔ Unauthorized: Invalid or missing token.' 
    });
  }

  const user = router.db.get('users').find({ id: decoded.id.toString() }).value();

  // Optional: Role check if only admins can add departments
  // if (user?.role !== 'admin') {
  //   return res.status(403).json({ 
  //     status: 'error', 
  //     message: '🚫 Forbidden: Admins only.' 
  //   });
  // }

  try {
    const newDepartment = {
      id: uuidv4(),
      ...req.body
    };

    router.db.get('departments').push(newDepartment).write();

    return res.status(201).json({ 
      status: 'success', 
      message: 'Department added successfully.',
      data: newDepartment 
    });

  } catch (error) {
    return res.status(500).json({ 
      status: 'error', 
      message: '❌ Failed to add department. Please try again.', 
      error: error.message 
    });
  }
});

server.post('/add-questions', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ 
      status: 'error', 
      message: '⛔ Unauthorized: Invalid or missing token.' 
    });
  }

  const user = router.db.get('users').find({ id: decoded.id.toString() }).value();

  // صلاحية الوصول (ممكن تفعلها لو بدك)
  // if (user?.role !== 'admin') {
  //   return res.status(403).json({ 
  //     status: 'error', 
  //     message: '🚫 Forbidden: Admins only.' 
  //   });
  // }

  try {
    const newQuestion = {
      id: uuidv4(),
      ...req.body
    };

    router.db.get('questions').push(newQuestion).write();

    return res.status(201).json({ 
      status: 'success', 
      message: 'Question added successfully.',
      data: newQuestion 
    });

  } catch (error) {
    return res.status(500).json({ 
      status: 'error', 
      message: '❌ Failed to add question. Please try again.', 
      error: error.message 
    });
  }
});



server.get('/departments', (req, res) => {
  const departments = router.db.get('departments').value();

  if (!departments || departments.length === 0) {
    return res.status(404).json({ message: 'No departments found' });
  }

  res.json(departments);
});



server.use(router);

server.listen(3001, () => {
  console.log('JSON Server is running on port 3001');
});
