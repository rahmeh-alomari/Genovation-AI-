import jsonServer from 'json-server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
  const userData = req.body;

  const existingUser = db.get('users').find({ email: userData.email }).value();
  if (existingUser) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const id = Date.now().toString();
  const newUser = { id, ...userData, password: hashedPassword };

  db.get('users').push(newUser).write();

  const { password, otp, ...safeUser } = newUser;

  const token = createToken({ id: safeUser.id, email: safeUser.email, role: safeUser.role });

  res.status(201).json({ user: safeUser, token });
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

server.use(router);

server.listen(3001, () => {
  console.log('JSON Server is running on port 3001');
});
