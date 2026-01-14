# GigFlow

A modern full-stack freelance gig marketplace platform built with React, TypeScript, Express, and MongoDB.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Development](#development)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)

## ✨ Features

### For Clients
- **Post Gigs**: Create and manage freelance job postings
- **Manage Bids**: View and accept bids from freelancers
- **Client Dashboard**: Track posted gigs, received bids, and active projects
- **Real-time Updates**: Instant notifications using Socket.IO

### For Freelancers
- **Browse Gigs**: Discover available freelance opportunities
- **Submit Bids**: Propose your services with custom rates
- **Freelancer Dashboard**: Track submitted bids and job applications
- **Profile Management**: Showcase your skills and experience

### General Features
- **User Authentication**: Secure JWT-based login and registration
- **Role-based Access**: Separate dashboards for clients and freelancers
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Toast Notifications**: Real-time feedback for user actions
- **REST API**: Well-structured backend API

## 🛠 Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time communication
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Socket.IO** - Real-time events
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
gigflow/
├── client/                    # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── context/          # Context API (Auth, Gig)
│   │   ├── pages/            # Page components
│   │   ├── layouts/          # Layout wrappers
│   │   ├── router/           # Route definitions
│   │   ├── App.tsx           # Root component
│   │   └── main.tsx          # Entry point
│   ├── public/               # Static assets
│   ├── package.json          # Dependencies
│   ├── vite.config.ts        # Vite configuration
│   ├── tsconfig.json         # TypeScript configuration
│   └── .env                  # Environment variables
│
├── server/                   # Express backend application
│   ├── src/
│   │   ├── controller/       # Route controllers
│   │   ├── model/            # MongoDB models
│   │   ├── routes/           # API routes
│   │   ├── utils/            # Helper functions
│   │   └── index.ts          # Server entry point
│   ├── package.json          # Dependencies
│   ├── tsconfig.json         # TypeScript configuration
│   └── .env                  # Environment variables
│
└── README.md                 # Project documentation
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** (comes with Node.js)
- **MongoDB** (local or cloud instance - MongoDB Atlas recommended)
- **Git**

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/gigflow.git
cd gigflow
```

### 2. Server Setup

```bash
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure environment variables (see .env.example)
# Edit .env with your MongoDB URI, JWT secret, etc.

# Build TypeScript
npm run build

# Start development server
npm run dev
```

The server will run on `http://localhost:4000`

### 3. Client Setup

```bash
cd ../client

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure environment variables (see .env.example)
# The default values should work if server is running locally

# Start development server
npm run dev
```

The client will run on `http://localhost:5173`

### 4. Database Setup

1. Create a MongoDB database (local or MongoDB Atlas)
2. Add your MongoDB connection string to `server/.env`:
   ```
   MONGO_URI=mongodb://localhost:27017/gigflow
   ```
   Or for MongoDB Atlas:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/gigflow
   ```

3. The database will be automatically initialized on first server run

## 💻 Development

### Running Both Client and Server Simultaneously

You can use two terminal windows:

```bash
# Terminal 1 - Server
cd server
npm run dev

# Terminal 2 - Client
cd client
npm run dev
```

### Building for Production

```bash
# Server
cd server
npm run build
npm start

# Client
cd client
npm run build
npm run preview
```

### Linting

```bash
# Client
cd client
npm run lint

# Fix ESLint issues
npm run lint -- --fix
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - Clear authentication cookie

### Gigs
- `GET /api/gigs` - Get all gigs (requires authentication)
- `POST /api/gigs` - Create new gig (requires authentication)

### Bids
- `POST /api/bids` - Submit a bid on a gig (requires authentication)
- `GET /api/bids/:gigId` - Get all bids for a specific gig (requires authentication)
- `GET /api/bids/free` - Get all bids submitted by the freelancer (requires authentication)
- `GET /api/bids/client` - Get all bids received by the client (requires authentication)
- `PATCH /api/bids/:bidId/hire` - Hire a freelancer for a bid (requires authentication)

## 🔐 Environment Variables

### Server (.env)
```
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret_key>
NODE_ENV=development
PORT=4000
CLIENT_URL=http://localhost:5173
```

### Client (.env)
```
VITE_API_URL=http://localhost:4000/api
VITE_BACKEND_URL=http://localhost:4000
```


## 📝 Code Standards

- **TypeScript**: Strict type checking enabled
- **Formatting**: ESLint configuration included
- **Component Structure**: Functional components with hooks
- **State Management**: React Context API for global state
- **Styling**: Tailwind CSS utility classes

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📜 License

This project is licensed under the ISC License.
