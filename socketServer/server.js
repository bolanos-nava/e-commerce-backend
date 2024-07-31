import express from 'express';
import { Server } from 'socket.io';

const app = express();

app.use(express.json());
app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

const PORT = process.env.PORT || 3000;
const httpServer = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const io = new Server(httpServer, { cors: { origin: '*' } });
io.on('connection', (socket) => {
  console.log('New client connected');
});

app.get('/', (req, res) => {
  res.send('ok');
});
app.post('/', (req, res) => {
  const { event, payload } = req.body;
  io.emit(event, payload);
  res.status(204).send();
});
