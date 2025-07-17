# ✅ Real-Time Collaborative Kanban Board

A **full-stack web application** built to enable **multiple users** to manage tasks on a shared Kanban-style board in **real time**. Inspired by tools like Trello, this clone goes beyond static task tracking—offering smart assignment, live sync via WebSockets, and intelligent conflict resolution between users.

<br/>

> 🌐 **Live App**: [https://your-live-app.vercel.app](https://your-live-app.vercel.app)  
> 🛠️ **Backend API**: [https://your-backend-api.render.com](https://your-backend-api.render.com)  
> 📺 **Demo Video**: [https://your-demo-video-link](https://your-demo-video-link)  
> 📄 **Logic Explanation**: [Logic_Document.md](./Logic_Document.md)

---

## 📝 Project Overview

This project is a **real-time collaborative To-Do board** where users can:
- Log in/register securely
- Create and manage tasks
- See changes live across all connected users
- Assign tasks automatically via Smart Assign
- Resolve simultaneous edits using conflict handling
- Track task history with an activity log

It was built as part of a coding assignment with emphasis on:
- **No template libraries** (pure React styling)
- **WebSocket integration**
- **Unique business logic**: Smart assign, conflict handling, validations

---

## 🧰 Tech Stack Used

| Layer       | Technology           | Purpose                             |
|-------------|----------------------|-------------------------------------|
| Frontend    | React + Vite         | UI + state management               |
| Backend     | Node.js + Express    | API server + authentication         |
| Database    | MongoDB + Mongoose   | Task and user storage               |
| Real-Time   | Socket.IO            | Bi-directional WebSocket sync       |
| Auth        | JWT + bcrypt         | Secure login & session management   |
| Hosting     | Vercel + Render      | Deployment of frontend & backend    |

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
## ⚙️ Setup & Installation Instructions

### 📂 Clone the Repo

```bash
git clone https://github.com/your-username/realtime-kanban.git
cd realtime-kanban


git clone https://github.com/your-username/realtime-todo-board.git
cd realtime-todo-board
