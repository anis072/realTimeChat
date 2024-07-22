const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

const PORT = 3000;

let users = [
  { id: '1', email: 'test1@example.com', password: 'password', username: 'User1', avatar: 'assets/images/user1.png' },
  { id: '2', email: 'test2@example.com', password: 'password', username: 'User2', avatar: 'assets/images/user2.jpg' },
];

let conversations = [
  { id: '1', lastMessage: 'Hello World', participants: ['1', '2'], messages: [] },
];

function getUserById(id) {
  return users.find(user => user.id === id);
}

function ensureConversationExists(participantIds) {
  let conversation = conversations.find(c =>
    c.participants.length === participantIds.length &&
    c.participants.every(id => participantIds.includes(id))
  );

  if (!conversation) {
    conversation = { id: (conversations.length + 1).toString(), lastMessage: '', participants: participantIds, messages: [] };
    conversations.push(conversation);
  }
  return conversation;
}

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    res.json({ token: `dummy-token-${user.id}`, user });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.get('/conversations', (req, res) => {
  const token = req.headers.authorization;
  const userId = token ? token.split('-')[2] : null;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userConversations = conversations
    .filter(c => c.participants.includes(userId))
    .map(c => ({
      ...c,
      participants: c.participants.map(id => getUserById(id))
    }));

  res.json(userConversations);
});

app.get('/conversations/:id/messages', (req, res) => {
  const token = req.headers.authorization;
  const userId = token ? token.split('-')[2] : null;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const conversation = conversations.find(c => c.id === req.params.id && c.participants.includes(userId));
  if (!conversation) {
    return res.status(404).json({ message: 'Conversation not found' });
  }

  res.json(conversation.messages);
});

app.post('/conversations/:id/messages', (req, res) => {
  const token = req.headers.authorization;
  const userId = token ? token.split('-')[2] : null;
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const conversation = conversations.find(c => c.id === req.params.id && c.participants.includes(userId));
  if (!conversation) {
    return res.status(404).json({ message: 'Conversation not found' });
  }

  const message = { sender: user, body: req.body.body, createdAt: new Date() };
  conversation.messages.push(message);
  conversation.lastMessage = message.body;
  io.emit('newMessage', { conversationId: req.params.id, message });
  res.json(message);
});

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
