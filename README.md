# Instagram-Clone

Welcome to the Instagram Clone project built with the MERN (MongoDB, Express, React, Node.js) stack. This project mimics the core functionality of Instagram, allowing users to sign up, post images, like posts, and follow other users.

## To run the project locally, follow the steps below:

### 1. Clone the repository

```code
git clone https://github.com/Kriti1908/Instagram-Clone.git
cd Instagram-Clone
```

### 2. Set up the Backend
Navigate to the backend directory and install the required dependencies.

```code
cd backend
npm install
```

### 3. Set up the Frontend
Navigate to the frontend directory and install the required dependencies.

```code
cd ../frontend
npm install
```

### 4. Run the Backend and Frontend
To run both the backend and frontend, you will need to start them in separate terminals:

#### Start the Backend:

```code
cd backend
npm start
```

#### Start the Frontend:

```code
cd frontend
npm start
```

## Technologies Used
- MongoDB: NoSQL database for storing user data and posts.
- Express: Web framework for Node.js to build the RESTful API.
- React: JavaScript library for building the user interface.
- Node.js: JavaScript runtime for building the server-side logic.
- Mongoose: MongoDB object modeling for Node.js.
- Cloudinary: Cloud storage for user image uploads.

## Features
- User authentication (Sign Up & Login)
- Post images and videos
- Like and comment on posts
- Follow and unfollow users
- Real-time updates for likes, comments, and posts (via sockets)
- Profile page with personal posts
- Bookmarking posts
- Getting suggested users
- Sending live messages
- Showing users as online/offline