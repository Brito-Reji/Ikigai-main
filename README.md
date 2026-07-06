# Ikigai - Find Your Purpose Through Learning

Ikigai is a comprehensive, modern Educational Platform designed to bridge the gap between passionate instructors and eager learners. Built with a robust MERN stack architecture, it offers a seamless experience for multi-role users including Students, Instructors, and Administrators.

---

## ✨ Features

### 🎓 For Students
- **Course Discovery:** Search, filter, and browse a wide variety of courses across different categories.
- **Seamless Learning:** Intuitive video player and curriculum tracking.
- **Secure Payments:** Integrated with Razorpay for safe and swift course purchases.
- **Real-time Communication:** Chat directly with instructors via integrated Socket.io rooms.
- **Progress Tracking:** Track learning progress, earn certificates, and download invoices (PDF).
- **Wishlist & Cart:** Save courses for later or purchase multiple at once.
- **Notifications:** Real-time bell notifications for course updates and announcements.

### 👨‍🏫 For Instructors
- **Course Management:** Create, edit, and publish courses with an intuitive builder.
- **Curriculum Builder:** Manage chapters and upload video lessons seamlessly (Cloudinary/AWS S3 integration).
- **Revenue Dashboard:** Track sales, revenue, and enrollments with interactive charts (Recharts).
- **Direct Student Interaction:** Respond to student queries in real-time.
- **Course Analytics:** Monitor course performance and reviews.

### 🛡️ For Administrators
- **Comprehensive Dashboard:** Oversee platform metrics, total revenue, and user growth.
- **User Management:** Manage students and instructors (block/unblock functionality).
- **Course Verification:** Review and approve submitted courses before they go live.
- **Category & Coupon Management:** Create and manage course categories and discount coupons.
- **Financial Reports:** Generate and download detailed sales reports.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** & **Vite** | Lightning-fast UI development and build tooling |
| **Tailwind CSS** | Utility-first CSS framework for responsive design |
| **Redux Toolkit** & **React Query** | State management and server-state caching |
| **React Router DOM** | Declarative routing for React |
| **Socket.io-client** | Real-time bidirectional communication |
| **Axios** | Promise-based HTTP client |
| **Recharts** | Composable charting library for analytics |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** & **Express.js** | Scalable RESTful API architecture |
| **MongoDB** & **Mongoose** | NoSQL database and object modeling |
| **Socket.IO** | Real-time WebSocket communication |
| **JWT & Bcrypt** | Secure authentication and password hashing |
| **Razorpay** | Payment gateway integration |
| **Cloudinary** & **AWS S3 SDK** | Cloud storage for images and video assets |
|**AWS CloudFront**| Implemented secure video delivery using AWS CloudFront signed URLs
| **Nodemailer** | Email service for OTP verification |
| **Google GenAI** | Integrated AI features for enhanced learning |

---

##  Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Git](https://git-scm.com/)

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/Brito-Rej/ikigai.git
cd ikigai
```

#### 2. Set up the Backend

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

#Cloudfront

CF_KEY_PAIR_ID=your_cloudfront_pair_id
CF_PRIVATE_KEY_PATH=./keys/private_key.pem

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET_NAME=your_s3_bucket_name

# Nodemailer
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# Google GenAI
GOOGLE_GENAI_API_KEY=your_google_genai_api_key

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

#### 3. Set up the Frontend

```bash
cd ../client
npm install
```

Create a `.env` file inside `client/`:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_SOCKET_URL=http://localhost:5000
```

#### 4. Run the Application

Open two terminals and run both servers.

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

The app will be available at `http://localhost:5173`.

---

##  Project Structure

```
ikigai/
├── client/                         # React (Vite) frontend
│   ├── public/                     # Static assets
│   │   └── logo.png
│   ├── src/
│   │   ├── api/                    # API calls (Axios)
│   │   ├── assets/                 # Images, icons
│   │   ├── components/             # Reusable UI components
│   │   ├── context/                # React context providers
│   │   ├── data/                   # Static/mock data
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── lib/                    # External configs/helpers
│   │   ├── pages/                  # Page-level components
│   │   ├── routes/                 # Route definitions
│   │   ├── services/               # Business logic / API layer
│   │   ├── store/                  # State management (Redux)
│   │   ├── styles/                 # Global styles / Tailwind
│   │   ├── utils/                  # Helper functions
│   │   ├── App.jsx                 # Root component
│   │   └── main.jsx                # Entry point
│   ├── index.html
│   └── vite.config.js
│
├── server/                         # Node.js / Express backend
│   ├── config/                    # Configurations (DB, AWS, etc.)
│   ├── controllers/               # Route controllers
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── instructor/
│   │   ├── public/
│   │   ├── students/
│   │   └── upload/
│   ├── cron/                      # Scheduled jobs (e.g., escrow release)
│   ├── middlewares/               # Auth, error handling, logging
│   ├── models/                    # Mongoose schemas
│   ├── routes/                    # API route definitions
│   ├── services/                  # Business logic layer
│   ├── socket/                    # WebSocket (chat, realtime)
│   ├── utils/                     # Helpers (tokens, email, logging)
│   ├── uploads/                   # Uploaded files
│   ├── app.js                     # Express app setup
│   └── server.js                  # Server entry point
│
├── package.json                   # Root dependencies
├── LICENSE
└── README.md
```

---

##  User Roles

| Role | Description |
|---|---|
| **Student** | Browse, purchase, and learn from courses |
| **Instructor** | Create and manage courses, interact with students |
| **Admin** | Oversee platform operations, users, and revenue |

---

##  Scripts

### Backend (`server/`)
| Command | Description |
|---|---|
| `npm run dev` | Start server in development mode with nodemon |
| `npm start` | Start server in production mode |

### Frontend (`client/`)
| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build. |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

##  Author

**Brito-Reji**  
GitHub: [@Brito-Reji](https://github.com/Brito-Reji)

---

> *Ikigai (生き甲斐) — Japanese concept meaning "reason for being." Find yours through learning.*
