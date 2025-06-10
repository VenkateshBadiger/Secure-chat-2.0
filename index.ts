require("dotenv").config();
import app from './app';
import db from './backend/db';
import { initSocket } from './backend/socket.io';

const PORT = parseInt(process.env.PORT || '3001', 10);


const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running at http://0.0.0.0:${PORT}`);
  db.connectDb();
});

initSocket(server);
