const app = require('./app');
const { connectDB } = require('./config/db');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB(); // ✅ chỉ gọi 1 lần ở đây

  app.listen(PORT, () => {
    console.log(`Server đang chạy tại đường dẫn: http://localhost:${PORT}`);
  });
}

startServer();