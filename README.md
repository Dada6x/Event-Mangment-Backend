# 🎉 Event Management Platform 🎉
The Event Management Platform is a comprehensive web application designed to manage events, users, and services. It provides a robust set of features for administrators, users, and event organizers to create, manage, and participate in events. The platform includes features such as user authentication, event creation, service management, and administrative tools.

## 🚀 Features
* User authentication and authorization using JSON Web Tokens (JWT)
* Event creation and management, including adding, editing, and canceling events
* Service management, including hospitality, photography, decoration, limousine, and musical band services
* Administrative tools for managing users, events, and event requests
* API documentation using Swagger UI
* Integration with MongoDB database for storing and retrieving data

## 🛠️ Tech Stack
* Frontend: Not applicable (API-only application)
* Backend: Node.js, Express.js
* Database: MongoDB
* Authentication: JSON Web Tokens (JWT)
* API Documentation: Swagger UI
* Dependencies: Mongoose, Cors, Dotenv, Bcryptjs, Jsonwebtoken

## 📦 Installation
To install the application, follow these steps:
1. Clone the repository using `git clone`
2. Install dependencies using `npm install`
3. Create a `.env` file with the following variables:
	* `MONGO_URI`: MongoDB connection string
	* `JWT_SECRET`: Secret key for JWT authentication
4. Start the application using `npm start`

## 💻 Usage
To use the application, follow these steps:
1. Start the application using `npm start`
2. Use a tool like Postman or cURL to send requests to the API endpoints
3. Authenticate using the `/login` endpoint and obtain a JWT token
4. Use the JWT token to access protected endpoints

## 📂 Project Structure
```
.
├── config
│   └── services_config.js
├── controller
│   ├── admin_controller.js
│   ├── auth_controller.js
│   ├── event_controller.js
│   └── user_controller.js
├── model
│   ├── event_model.js
│   ├── request_model.js
│   ├── user_model.js
│   └── venue_model.js
├── routes
│   ├── admin_routes.js
│   ├── event_routes.js
│   └── services_routes.js
├── server.js
├── utils
│   └── jwt_helper.js
└── package.json
```

## 📸 Screenshots

## 🤝 Contributing
To contribute to the project, please follow these steps:
1. Fork the repository using `git fork`
2. Create a new branch using `git branch`
3. Make changes and commit them using `git commit`
4. Push the changes to the remote repository using `git push`
5. Create a pull request using the GitHub web interface

## 📝 License
The Event Management Platform is licensed under the MIT License.

## 📬 Contact
For any questions or concerns, please contact us at [support@example.com](mailto:support@example.com).

## 💖 Thanks Message
This is written by [readme.ai](https://readme-generator-phi.vercel.app/)
