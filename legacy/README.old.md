# 🤖 AI Interview Assistant

An AI-powered Interview Preparation Platform that helps candidates practice technical interviews, receive instant feedback, track performance, and improve interview skills.

---

## 🚀 Features

- 🔐 User Registration & Login (JWT Authentication)
- 🎯 Category-based Interviews
- 📊 Difficulty Selection (Easy, Medium, Hard)
- 📄 Resume Upload
- 🎤 Voice-to-Text Answer Input
- 🔊 Text-to-Speech Questions
- ⏱️ 30-Second Timer
- 📈 Performance Dashboard
- 📊 Interview History
- 👨‍💼 Admin Panel
- 📝 Question Management
- 🤖 AI Answer Evaluation *(Coming Soon)*
- 📑 Resume Analysis *(Coming Soon)*

---

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript
- Chart.js
- Web Speech API

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

### AI
- Google Gemini API *(Integration in Progress)*

---

## 📁 Project Structure

```
Interview-Assistant/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   ├── admin.html
│   ├── admin.js
│   ├── dashboard.html
│   └── dashboard.js
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── uploads/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/Bhavish295/AI-Interview-Assistant.git
```

### Install Backend Dependencies

```bash
cd backend
npm install
```

### Create Environment File

Create a `.env` file inside the `backend` folder.

```env
PORT=5000

MONGO_URI=YOUR_MONGODB_URI

JWT_SECRET=YOUR_SECRET

GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

### Run Backend

```bash
npm run dev
```

---

## 📌 Current Features

- Authentication System
- Technical Interview Questions
- Live Timer
- Voice Answer Support
- Dashboard
- Interview Result Storage
- Resume Upload
- Admin Question Management

---

## 🚧 Upcoming Features

- AI Answer Evaluation using Gemini
- Resume Skill Analysis
- AI Interview Feedback
- PDF Interview Report
- Email Report
- Company-wise Interview Sets
- Dark Mode
- Candidate Profile

---

## 👨‍💻 Developed By

**Bhavish Kumar**

BS Computer Science

SZABIST Hyderabad

GitHub: https://github.com/Bhavish295

---

## ⭐ Support

If you like this project, don't forget to **Star ⭐ the repository**.
