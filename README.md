# Web Perpus Ganesha

A full-stack library management web application built with Vue.js frontend and Express.js backend.

## 📋 About

**Web Perpus Ganesha** is a comprehensive web-based library management system designed to streamline library operations and provide an intuitive interface for users to browse, search, and manage library resources.

## 🏗️ Project Structure

```
web-perpus-ganesha/
├── frontend/              # Vue 3 + Vite frontend application
├── server/                # Express.js backend API
├── package.json           # Root project configuration
└── README.md
```

### Frontend
- **Framework**: Vue 3
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, Sass
- **State Management**: Vue Router
- **Charts**: Chart.js
- **HTTP Client**: Axios
- **Icons**: Lucide Vue Next

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer
- **CORS**: Enabled for cross-origin requests
- **Environment**: dotenv for configuration

## 🚀 Getting Started

### Prerequisites
- Node.js `^20.19.0 || >=22.12.0`
- npm or yarn
- MySQL database

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Xixiqo/web-perpus-ganesha.git
cd web-perpus-ganesha
```

2. **Install root dependencies**
```bash
npm install
```

3. **Install frontend dependencies**
```bash
cd frontend
npm install
cd ..
```

4. **Install server dependencies**
```bash
cd server
npm install
cd ..
```

### Environment Setup

Create a `.env` file in the server directory with your configuration:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=perpus_ganesha
JWT_SECRET=your_secret_key
PORT=3000
```

## 📝 Available Scripts

### Root Level
```bash
npm run start              # Start the backend server
npm run dev               # Start backend with auto-reload (nodemon)
npm run serve-frontend    # Serve frontend from dist folder
npm run pm2-start         # Start backend with PM2
npm run pm2-stop          # Stop PM2 backend process
npm run pm2-restart       # Restart PM2 backend process
```

### Frontend (from frontend/ directory)
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Lint and fix code
npm run format           # Format code with Prettier
```

### Backend (from server/ directory)
```bash
npm start                # Start the server
npm run dev              # Start with nodemon for development
```

## 🛠️ Technologies Used

### Frontend Stack
- **Vue.js 3.5.18** - Progressive JavaScript framework
- **Vite 7.0.6** - Next generation frontend tooling
- **Tailwind CSS 3.4.18** - Utility-first CSS framework
- **Chart.js 4.5.1** - JavaScript charting library
- **Vue Router 4.5.1** - Official router for Vue.js
- **Axios 1.11.0** - HTTP client

### Backend Stack
- **Express.js 4.18.2** - Fast, unopinionated web framework
- **MySQL 2** - Relational database
- **JWT** - Secure token-based authentication
- **bcryptjs** - Password encryption
- **Multer** - File upload handling
- **CORS** - Cross-Origin Resource Sharing support

## 📦 Key Dependencies

### Frontend
- `vue@^3.5.18`
- `vite@^7.0.6`
- `tailwindcss@^3.4.18`
- `chart.js@^4.5.1`
- `axios@^1.11.0`
- `vue-router@^4.5.1`
- `lucide-vue-next@^0.545.0`

### Backend
- `express@^4.18.2`
- `mysql2@^3.15.2`
- `jsonwebtoken@^9.0.2`
- `bcryptjs@^3.0.2`
- `cors@^2.8.5`
- `multer@^2.0.2`
- `dotenv@^17.2.3`

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs for secure password storage
- **CORS Protection** - Configured CORS for safe cross-origin requests
- **Environment Variables** - Sensitive data managed via .env files

## 📖 API Documentation

The backend API is built with Express.js and follows RESTful principles. Key endpoints include:
- Authentication endpoints (login, register)
- Book management (CRUD operations)
- User management
- Library operations

For detailed API documentation, refer to the server source code.

## 🎨 Features

- 📚 Book/Resource Management
- 👥 User Management System
- 🔐 Secure Authentication
- 📊 Analytics Dashboard
- 🔍 Search Functionality
- 📱 Responsive Design
- 📈 Statistics and Reports

## 📄 License

This project is licensed under the **ISC License**. See the [LICENSE](./LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues, questions, or suggestions, please open an issue on the [GitHub repository](https://github.com/Xixiqo/web-perpus-ganesha/issues).

---

**Last Updated**: February 12, 2026
