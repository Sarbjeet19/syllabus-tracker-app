# Syllabus Tracker Application

This repository contains the full-stack code for the Syllabus Tracker application.

## Overview

This project is a web application designed to help students track their progress against a syllabus. It features a React frontend and a Node.js/Express backend with a MongoDB database.

### Frontend (`/syllabus-tracker-frontend`)
- Built with React and Vite.
- Styled with Tailwind CSS.
- Features a full user authentication flow and an interactive dashboard.

### Backend (`/syllabus-tracker-backend`)
- Built with Node.js and Express.
- Uses MongoDB for the database.
- Provides a secure REST API for all frontend functionality.

## How to Run
On opening the parent file, We will see two files in VS Code-

syllabus-tracker-backend
syllabus-tracker-frontend

--OPEN A TERMINAL
command--
cd syllabus-tracker-backend
npm run dev

RESULT--
PS D:\syllabus-tracker-app\syllabus-tracker-backend> npm run dev

> syllabus-tracker-backend@1.0.0 dev
> nodemon server.js

[nodemon] 3.1.10
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
 a performance overhead.
To eliminate this warning, add "type": "module" to D:\syllabus-tracker-app\syllabus-tracker-backend\package.json.        
(Use `node --trace-warnings ...` to show where the warning was created)
[dotenv@17.2.1] injecting env (5) from .env -- tip: ⚙️  enable debug logging with { debug: true }
[dotenv@17.2.1] injecting env (0) from .env -- tip: ⚙️  load multiple .env files with { path: ['.env.local', '.env'] }   
🚀 Server running on port 5000
✅ Connected to MongoDB



--OPEN ANOTHER NEW TERMINAL
command--
cd syllabus-tracker-frontend
npm run dev

RESULT--
PS D:\syllabus-tracker-app\syllabus-tracker-frontend> npm run dev

> syllabus-tracker-frontend@0.0.0 dev
> vite

1:38:29 PM [vite] (client) Re-optimizing dependencies because vite config has changed

  VITE v7.1.1  ready in 704 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
