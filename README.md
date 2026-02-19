## 💰 SmartSpend

SmartSpend is a full-stack expense tracking application designed to help users manage their personal finances with clarity and control.
The platform provides secure user authentication, real-time expense tracking, and interactive data visualization. Users can categorize spending, track trends, and gain meaningful insights into their financial habits — all within a modern, responsive UI.
## 📸 Screenshots

![SmartSpend Dashboard](https://github.com/user-attachments/assets/2df1593a-cec1-41a0-954e-9be54fb0ed68)

![Login/Register Page](https://github.com/user-attachments/assets/38530802-f8d5-4c89-8c35-a8b57f957460)


🚀 Features
🔐 Secure User Authentication
User registration and login functionality

Password hashing using Bcrypt

JWT-based authentication for protected routes

User-specific data isolation for privacy and security

📊 Interactive Data Visualization
Dynamic charts to visualize spending trends

Category-wise expense breakdown

Real-time updates after add/delete actions

Summary endpoint for total and per-category insights

➕ Expense Management
Add, edit, and delete expenses with title, category, amount, and date

Secure data storage in PostgreSQL

Responsive updates across dashboard components

📅 Advanced Filtering
Filter by category and date range

Sort expenses by most recent or oldest

View targeted summaries for budgeting precision

📂 Categorization System
Custom categories for structured tracking

Per-category analytics and summaries

Relational data modeling ensures efficiency

📱 Responsive & Modern UI
Fully responsive layout using TailwindCSS

Clean, minimal, and user-friendly dashboard

Optimized for both desktop and tablet use



🛠 Tech Stack
Frontend

React

TailwindCSS

Chart library (e.g., Chart.js / Recharts)

Backend

Python

Flask

Flask-JWT / Flask-Login (if applicable)

Database

PostgreSQL


⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/SphinxVon/SmartSpend.git
cd smartSpend

2️⃣ Backend Setup (Flask)
cd backend
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
 run :- python app.py

