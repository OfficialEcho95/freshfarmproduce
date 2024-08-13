# E-commerce Backend Implementation

This project is a complete backend implementation of an e-commerce application that handles all backend requirements for an e-commerce website. It includes payment processing using Paystack and provides some frontend code in HTML to give you an insight into the backend functionality.

## Setup Instructions

### 1. Clone the Repository
```
git clone (https://github.com/OfficialEcho95/freshfarmproduce)
cd <repository-directory>
```

### 2. Install dependencies
```
npm install
```

### 3. Set Up Environment Variables
Create a .env file in the root of your project.
```
Add the following environment variables:
PORT=3000
MONGODB_URI=<your-mongodb-connection-string>
PAYSTACK_SECRET_KEY=<your-paystack-secret-key>
AUTH_KEY=<your-authentication-secret-key>
```

### 4. Set Up MongoDB
Create a MongoDB account if you don’t have one.
Create a new database and update the MONGODB_URI in your .env file with the connection string provided by MongoDB

### 5. Start the Application
```
npm start
```
The server should now be running, and you can access it at http://localhost:3000.

### 6. Test the Application
Use an API testing tool like Postman to test the endpoints.
Optionally, explore the frontend by opening the index.html file in your browser.
