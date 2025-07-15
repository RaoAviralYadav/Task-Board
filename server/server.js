const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // ⚠️ Vite frontend runs on 5173
    credentials: true,
  },
});

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ Mongo error:", err));

// Dummy test route
app.get("/", (req, res) => res.send("API is running..."));

// Routes will go here
// app.use('/api/auth', require('./routes/auth'))

// Socket.io Setup (mocked for now)
io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

app.use("/api/groups", require("./routes/groups"));


app.use("/api/tasks", require("./routes/tasks"));
// Error handling middleware