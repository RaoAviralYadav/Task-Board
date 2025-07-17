# 🧠 Real-Time Collaborative To-Do Board (Trello Clone)

A full-stack web application that lets users manage tasks collaboratively in real-time. Built with **React**, **Node.js**, **Express**, **MongoDB**, and **Socket.IO**, the app allows multiple users to log in, create and assign tasks, track activity, and experience seamless updates without refreshing—just like Trello, but better.

> 🔴 Live Demo: [https://your-frontend-url.vercel.app](https://your-frontend-url.vercel.app)  
> ⚙️ Backend: [https://your-backend-url.onrender.com](https://your-backend-url.onrender.com)  
> 🎥 Demo Video: [https://your-demo-video-link](https://your-demo-video-link)  
> 📄 Logic Document: [Logic_Document.md](./Logic_Document.md)

---

## 📦 Tech Stack

| Frontend              | Backend               | Real-Time           | Database        |
|----------------------|-----------------------|---------------------|-----------------|
| React + Vite         | Node.js + Express     | Socket.IO           | MongoDB (Atlas) |
| React DnD / Context  | JWT Auth + bcrypt     | WebSocket Protocol  | Mongoose ODM    |

---

## 🚀 Features

### 👤 Authentication
- Secure Login & Registration using JWT
- Passwords hashed using bcrypt
- Role-based user system

### 🧠 Kanban Board
- Fully draggable tasks across **Todo**, **In Progress**, and **Done**
- Task cards with title, description, assignee, priority
- Responsive layout (mobile + desktop)
- Unique UI (no Bootstrap or CSS libraries)

### ⚡ Real-Time Sync
- Uses **Socket.IO** to instantly broadcast:
  - New task creation
  - Task updates (title, desc, status)
  - Smart assignment
- No refresh needed—updates appear live on all tabs

### 🧩 Smart Assign
- Assigns task to the user with the **fewest active tasks**
- Automatically calculated from backend load counts

### ⚔️ Conflict Handling
- Detects if multiple users edit a task at the same time
- Prompts user with two options:
  - **Load Server Version**
  - **Overwrite Anyway**

### 🧾 Activity Log
- Tracks who did what (edit/move/assign)
- Only shows the **last 20 actions** per task
- Viewable under “📋 Activity” tab of modal

### ✅ Validations
- **Task titles must be unique per board**
- **Title cannot match column names** like “Todo”, “In Progress”, “Done”

### 🎨 Custom UI & Animation
- Sidebar slide-in on mobile
- Smooth drag and drop
- Blur and popup effects on modal open

---

## 🧰 Installation & Setup Guide

### 🔧 Prerequisites
- Node.js and npm
- MongoDB Atlas URI
- Vite or npm to run React

---

### 1. Clone the Repo
```bash
git clone https://github.com/your-username/realtime-todo-board.git
cd realtime-todo-board
