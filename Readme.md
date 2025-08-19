# Backend API for Video Platform

This is a Node.js backend project for a video-sharing platform. It provides RESTful APIs for user authentication, profile management, video handling, and subscriptions.

## Features

- **User Authentication:** Register, login, logout, JWT-based authentication, refresh tokens.
- **Profile Management:** Update avatar, cover photo, and profile info.
- **Video Management:** Upload, view, and manage videos.
- **Subscriptions:** Subscribe/unsubscribe to channels.
- **Cloudinary Integration:** Image upload and deletion.
- **Error Handling:** Centralized error middleware.
- **Secure Cookies:** HTTP-only and secure cookies for tokens.

## Tech Stack

- Node.js
- Express.js
- MongoDB & Mongoose
- JWT for authentication
- Cloudinary for image storage
- Multer for file uploads

## Folder Structure

```
src/
  app.js                # Express app setup
  constants.js          # App constants
  index.js              # Entry point
  controllers/          # Route controllers
  db/                   # Database connection
  middlewares/          # Auth, error, multer middlewares
  models/               # Mongoose models
  routes/               # Express routers
  utils/                # Utility classes and functions
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB instance
- Cloudinary account

### Installation

1. Clone the repository:
   ```
   git clone <your-repo-url>
   cd BackEnd
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add the following:
   ```
   MONGODB_URI=your_mongodb_connection_string
   ACCESS_TOKEN_SECRET=your_access_token_secret
   ACCESS_TOKEN_EXPIRY=15m
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRY=7d
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   CORS_ORIGIN=http://localhost:3000
   ```

### Running the Server

```
npm start
```

The server will run on the port specified in your environment variables or default to `5000`.

## API Endpoints

### User Routes

- `POST /api/v1/users/register` — Register a new user
- `POST /api/v1/users/login` — Login user
- `POST /api/v1/users/logout` — Logout user
- `POST /api/v1/users/Token-Refresh` — Refresh access token
- `PUT /api/v1/users/updateAvatar` — Update user avatar
- `PUT /api/v1/users/updateCoverPhoto` — Update user cover photo
- `PUT /api/v1/users/updateProfile` — Update user profile

### Video & Subscription Routes

*(Add endpoints as implemented)*

## License

MIT

## Author

Debarshi