# Ikigai - Find Your Purpose Through Learning



Ikigai is a comprehensive, modern Educational Platform designed to bridge the gap between passionate instructors and eager learners. Built with a robust MERN stack architecture, it offers a seamless experience for multi-role users including Students, Instructors, and Administrators.

## ✨ Features

### 🎓 For Students
*   **Course Discovery:** Search, filter, and browse a wide variety of courses across different categories.
*   **Seamless Learning:** Intuitive video player and curriculum tracking.
*   **Secure Payments:** Integrated with Razorpay for safe and swift course purchases.
*   **Real-time Communication:** Chat directly with instructors via integrated Socket.io rooms.
*   **Progress Tracking:** Track learning progress, earn certificates, and download invoices (PDF).
*   **Wishlist & Cart:** Save courses for later or purchase multiple at once.
*   **Notifications:** Real-time bell notifications for course updates and announcements.

### 👨‍🏫 For Instructors
*   **Course Management:** Create, edit, and publish courses with an intuitive builder.
*   **Curriculum Builder:** Manage chapters and upload video lessons seamlessly (Cloudinary/AWS S3 integration).
*   **Revenue Dashboard:** Track sales, revenue, and enrollments with interactive charts (Recharts).
*   **Direct Student Interaction:** Respond to student queries in real-time.
*   **Course Analytics:** Monitor course performance and reviews.

### 🛡️ For Administrators
*   **Comprehensive Dashboard:** Oversee platform metrics, total revenue, and user growth.
*   **User Management:** Manage students and instructors (block/unblock functionality).
*   **Course Verification:** Review and approve submitted courses before they go live.
*   **Category & Coupon Management:** Create and manage course categories and discount coupons.
*   **Financial Reports:** Generate and download detailed sales reports.

## 🛠️ Tech Stack

### Frontend
*   **React 19** & **Vite**: Lightning-fast UI development and build tooling.
*   **Tailwind CSS**: Utility-first CSS framework for beautiful, responsive design.
*   **Redux Toolkit** & **React Query (@tanstack/react-query)**: State management and server-state caching.
*   **React Router DOM**: Declarative routing for React.
*   **Socket.io-client**: Real-time bidirectional event-based communication.
*   **Axios**: Promise-based HTTP client for the browser.
*   **Recharts**: Composable charting library for analytic dashboards.

### Backend
*   **Node.js** & **Express.js**: Scalable backend RESTful API architecture.
*   **MongoDB** & **Mongoose**: NoSQL database and elegant object modeling.
*   **Socket.IO**: Real-time web socket communication for chats and notifications.
*   **JWT & Bcrypt**: Secure user authentication and password hashing.
*   **Razorpay**: Payment gateway integration.
*   **Cloudinary** & **AWS S3 SDK**: Efficient cloud storage for images and large video course assets.
*   **Nodemailer**: Email service for OTP verification and notifications.
*   **Google GenAI**: Integrated AI features to enhance the learning experience.

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js and MongoDB installed on your local machine.

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/ikigai.git
    cd ikigai
    ```

2.  **Install Application Dependencies**
    Open two terminal windows/tabs, one for the client and one for the server.

    *Backend Setup:*
    ```bash
    cd server
    npm install
    ```

    *Frontend Setup:*
    ```bash
    cd client
    npm install
    ```

3.  **Environment Variables**
    Create a `.env` file in both the `client` and `server` directories based on `.env.example`.

    *Required Server env variables (example):*
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    RAZORPAY_KEY_ID=your_razorpay_id
    RAZORPAY_KEY_SECRET=your_razorpay_secret
    CLOUDINARY_CLOUD_NAME=your_cloudinary_name
    CLOUDINARY_API_KEY=your_cloudinary_key
    CLOUDINARY_API_SECRET=your_cloudinary_secret
    # Add AWS and Email config as required
    ```

    *Required Client env variables (example):*
    ```env
    VITE_API_URL=http://localhost:5000/api
    VITE_GOOGLE_ID=your_google_oauth_client_id
    ```

4.  **Run the Application**

    *Start the server:*
    ```bash
    cd server
    npm run dev
    ```

    *Start the client:*
    ```bash
    cd client
    npm run dev
    ```

5.  **Access the application**
    Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📁 Directory Structure
```
ikigai/
├── client/          # React + Vite Frontend application
│   ├── public/      # Static assets
│   └── src/
│       ├── api/     # Axios configs & API wrappers
│       ├── assets/  # Images and icons
│       ├── components/# Reusable UI components
│       ├── hooks/   # Custom React hooks
│       ├── pages/   # Application pages (Admin, Instructor, Student)
│       └── store/   # Redux store and slices
└── server/          # Node.js + Express Backend application
    ├── controllers/ # Route controllers (Logic)
    ├── models/      # Mongoose Database Models
    ├── routes/      # Express API Routes
    └── services/    # Business logic layer
```

## 🤝 Contributing
This project is a personal portfolio piece designed to showcase my skills and development capabilities. As such, I am **not** currently accepting pull requests or external contributions. However, feel free to fork the repository for your own learning purposes!

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
