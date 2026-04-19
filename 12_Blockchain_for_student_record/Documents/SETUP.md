# 🚀 Quick Setup Instructions

## Prerequisites
- **Node.js** v14+ ([download](https://nodejs.org/))
- **npm** v6+ (included with Node.js)
- **MongoDB** local server running on `mongodb://localhost:27017`
  - Install [MongoDB Community](https://www.mongodb.com/try/download/community)
  - Start: `mongod` (or via MongoDB Compass)

## Backend Setup (`BackEnd/`)
```bash
cd BlockChain_For_Student_Record_System/BackEnd
npm install
# Copy .env.example to .env and set MONGO_URI=mongodb://localhost:27017/Block-Chain, JWT_SECRET=your_secret
node app.js
```
- Runs on `http://localhost:8000`

## Frontend Setup (`FrontEnd/`)
```bash
cd BlockChain_For_Student_Record_System/FrontEnd
npm install
npm start
```
- Runs on `http://localhost:3000`

## Test Access
- Backend: `http://localhost:8000/`
- Frontend: Open `http://localhost:3000` in browser

## Admin Login (Frontend)
- Email: `admin@gmail.com`
- Password: `admin1`

## Troubleshooting
- **MongoDB not connected**: Ensure `mongod` is running, check MONGO_URI in .env.
- **npm errors**: Delete `node_modules/`, `package-lock.json`, rerun `npm install`.
- **CORS issues**: Backend CORS is enabled.
- **Port in use**: Change PORT in BackEnd/app.js.

For full details, see [README.md](README.md).

**Last Updated**: $(date)
