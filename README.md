# MERN Stack To-Do List Application

This is a full-stack To-Do List application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) as per the interview task requirements. It includes user registration, login, profile management, and complete CRUD functionality for to-do items with filtering and searching.

this line is new to test CI pipeline

## Features

* **User Authentication:**
    * User registration (Name, Email, Password, Phone)
    * Secure password hashing (bcryptjs)
    * User login with email and password
    * JWT (JSON Web Token) based authentication for protected routes
    * User logout
* **User Profile Management:**
    * View personal details (Name, Email, Phone)
    * Edit/Update personal details
* **To-Do List Management:**
    * Add new to-do items (Title, Description, Due Date)
    * View all to-do items for the logged-in user
    * Edit existing to-do items
    * Delete to-do items
    * Mark tasks as 'completed' or 'pending'
    * Filter tasks by status (All, Pending, Completed)
    * Search tasks by title (case-insensitive)
* **API:**
    * RESTful API built with Node.js and Express.
    * Uses MongoDB with Mongoose for data modeling and persistence.

## Tech Stack

* **Frontend:**
    * React.js (`create-react-app`)
    * React Router (`react-router-dom`) for client-side routing
    * Axios for API requests
    * React Context API for global state management (authentication)
    * Tailwind CSS for styling
* **Backend:**
    * Node.js
    * Express.js framework
    * MongoDB (database)
    * Mongoose (ODM for MongoDB)
    * JSON Web Tokens (`jsonwebtoken`) for authentication
    * bcryptjs for password hashing
    * `dotenv` for environment variables
    * `cors` for enabling cross-origin requests
    * `express-validator` for request validation

## Prerequisites

Before you begin, ensure you have the following installed:

* [Node.js](https://nodejs.org/) (which includes npm) - Version 20.x or higher recommended.
* [MongoDB](https://www.mongodb.com/try/download/community) - Make sure the MongoDB server is running. You can use a local installation or a cloud service like MongoDB Atlas.

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-directory-name>
    ```

## Backend Setup (`server` directory)

1.  **Navigate to the server directory:**
    ```bash
    cd server
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create Environment Variables File:**
    * Create a file named `.env` in the `server` directory.
    * Add the following environment variables, replacing placeholder values as needed:

        ```plaintext
        # .env (Server)

        # Server Port (Choose a port, e.g., 5001)
        PORT=5001

        # MongoDB Connection URI
        # For local MongoDB (replace 'todoapp' with your desired DB name):
        MONGO_URI=mongodb://127.0.0.1:27017/todoapp
        # For MongoDB Atlas (replace placeholders):
        # MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority

        # JWT Secret Key (Replace with a strong, random string)
        JWT_SECRET=your_very_strong_and_secret_jwt_key
        ```
    * **Important:** Add `.env` to your `.gitignore` file if it's not already there to avoid committing sensitive data.

4.  **Run the Backend Server:**
    * For development (with automatic restarts using `nodemon`):
        ```bash
        npm run dev
        ```
    * For production:
        ```bash
        npm start
        ```
    * The server should start, typically on the port specified in your `.env` file (e.g., 5001), and connect to MongoDB.

## Frontend Setup (`client` directory)

1.  **Navigate to the client directory:**
    ```bash
    # From the project root directory
    cd client
    # Or from the server directory
    # cd ../client
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Environment Variables (Optional):**
    * The frontend uses `http://localhost:5001/api` (or the port set in the backend `.env`) as the default API URL (defined in `src/services/api.js`).
    * If your backend runs on a different URL or port, you can create a `.env` file in the `client` directory and set the `REACT_APP_API_URL` variable:
        ```plaintext
        # .env (Client - Optional)
        REACT_APP_API_URL=http://localhost:YOUR_BACKEND_PORT/api
        ```

4.  **Run the Frontend Development Server:**
    ```bash
    npm start
    ```
    * This will usually open the application automatically in your browser at `http://localhost:3000`.

## Using the Application

1.  Make sure both the backend and frontend servers are running.
2.  Open your browser to `http://localhost:3000` (or the port specified by the React development server).
3.  Register a new user or log in with existing credentials.
4.  Navigate the dashboard to manage your to-do items.
5.  Visit the profile page to view or update your details.

## API Endpoints (Brief Overview)

* **Auth:**
    * `POST /api/auth/register`: Register a new user.
    * `POST /api/auth/login`: Log in a user, returns JWT.
* **Users:**
    * `GET /api/users/me`: Get logged-in user's profile (Protected).
    * `PUT /api/users/me`: Update logged-in user's profile (Protected).
* **Todos:**
    * `POST /api/todos`: Create a new todo (Protected).
    * `GET /api/todos`: Get all todos for the user (Protected). Supports `?status=` and `?search=` query parameters.
    * `PUT /api/todos/:id`: Update a specific todo (Protected).
    * `DELETE /api/todos/:id`: Delete a specific todo (Protected).

