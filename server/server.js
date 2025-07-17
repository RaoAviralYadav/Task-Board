// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const mongoose = require("mongoose");
// const http = require("http");
// const { Server } = require("socket.io");

// dotenv.config();

// const app = express();
// const server = http.createServer(app);

// // ✅ SOCKET.IO SETUP
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173", // ⚠️ Vite frontend
//     credentials: true,
//   },
// });

// // 🌐 Middleware
// app.use(cors());
// app.use(express.json());

// // ✅ Inject io into every request
// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });
// app.set("io", io);
// // ✅ ROUTES
// app.use("/api/auth", require("./routes/auth"));
// app.use("/api/groups", require("./routes/groups"));
// app.use("/api/tasks", require("./routes/tasks")); // <-- Now has access to req.io

// // ✅ Connect MongoDB
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch(err => console.log("❌ Mongo error:", err));

// // Dummy test route
// app.get("/", (req, res) => res.send("API is running..."));

// // ✅ SOCKET CONNECTION HANDLER
// io.on("connection", (socket) => {
//   console.log("🟢 New client connected:", socket.id);

//   // Optional: Join rooms per groupId or userId
//   // socket.on("join", (roomId) => {
//   //   socket.join(roomId);
//   //   console.log(`🛏️ Socket ${socket.id} joined room ${roomId}`);
//   // });

//   socket.on("disconnect", () => {
//     console.log("🔴 Client disconnected:", socket.id);
//   });
// });

// // ✅ START SERVER
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ SOCKET.IO SETUP
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // ⚠️ Vite frontend
    credentials: true,
  },
});

// 🌐 Middleware
app.use(cors());
app.use(express.json());

// ✅ Inject io into every request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ✅ ROUTES
app.use("/api/auth", require("./routes/auth"));
app.use("/api/groups", require("./routes/groups"));
app.use("/api/tasks", require("./routes/tasks")); // <-- Now has access to req.io

// ✅ Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ Mongo error:", err));

// Dummy test route
app.get("/", (req, res) => res.send("API is running..."));

// ✅ SOCKET CONNECTION HANDLER
io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  // Optional: Join rooms per groupId or userId
  // socket.on("join", (roomId) => {
  //   socket.join(roomId);
  //   console.log(`🛏️ Socket ${socket.id} joined room ${roomId}`);
  // });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// ✅ START SERVER
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
