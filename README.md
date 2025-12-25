# Event Management Backend API

A comprehensive backend system for managing events, users, and administrative functions with a request-based workflow.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [User Roles](#user-roles)
- [Event Workflow](#event-workflow)
- [Services](#services)
- [Project Structure](#project-structure)
- [Usage Examples](#usage-examples)
- [Contributing](#contributing)
- [License](#license)

## Overview

The Event Management Backend is a Node.js/Express application that provides a robust API for managing events, users, and administrative tasks. It features a request-based system where users submit event creation/edit requests that must be approved by administrators before becoming active events.

## Features

### Core Features
- **User Management**: Registration, login, and profile management
- **Event Management**: Create, edit, and cancel events through a request system
- **Admin Dashboard**: Approve/reject event requests and manage users
- **Service Management**: Configure and select event services (hospitality, camera, decoration, etc.)
- **Venue Management**: Manage event locations with different types (lounge, theatre, home)

### Advanced Features
- **Request-Based Workflow**: All event changes go through admin approval
- **Role-Based Access Control**: Different permissions for users and admins
- **JWT Authentication**: Secure API endpoints with JSON Web Tokens
- **Comprehensive API Documentation**: Swagger/OpenAPI integration
- **Service Cost Calculation**: Automatic price calculation based on selected services

## Technologies

- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **MongoDB**: Database with Mongoose ODM
- **JWT**: Authentication using JSON Web Tokens
- **Swagger**: API documentation
- **CORS**: Cross-origin resource sharing
- **bcryptjs**: Password hashing
- **dotenv**: Environment variables management

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/event-management-backend.git
   cd event-management-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://127.0.0.1:27017/Event_mangment
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=1d
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Access the API:
   - Base URL: `http://localhost:3000`
   - API Documentation: `http://localhost:3000/api-docs`

## Configuration

### Database Configuration
The application uses MongoDB. Update the connection string in `server.js` or in your `.env` file:

```javascript
mongoose.connect("mongodb://127.0.0.1:27017/Event_mangment")
```

### Service Configuration
Event services and their costs can be configured in `config/services_config.js`.

## API Documentation

The API is fully documented using Swagger/OpenAPI. After starting the server, access the interactive documentation at:

📖 **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

### API Endpoints Overview

#### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

#### Users
- `GET /api/me` - Get current user information
- `GET /api/my-events` - Get all accepted events for current user

#### Events
- `POST /api/events` - Create a new event request
- `GET /api/events` - Get all my event requests
- `PATCH /api/events` - Submit an edit request for an existing event
- `GET /api/events/{id}` - Get event request details
- `DELETE /api/events/{id}` - Cancel an event request

#### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/events` - Get all accepted events (admin only)
- `GET /api/admin/requests` - Get all event requests (admin only)
- `PATCH /api/admin/requests/{id}/approve` - Approve an event request
- `PATCH /api/admin/requests/{id}/reject` - Reject an event request

#### Services
- `GET /api/services` - Get all services configuration
- `GET /api/services/venues` - Get all active venues (with optional type filter)

## Authentication

The API uses JWT (JSON Web Token) for authentication. After successful login, you'll receive a token that must be included in the `Authorization` header for protected routes:

```http
Authorization: Bearer your_jwt_token_here
```

## User Roles

The system supports two user roles:

- **User**: Can create event requests, view their own events, and manage their profile
- **Admin**: Has full access including approving/rejecting event requests and managing all users

## Event Workflow

1. **User creates event request**: User submits event details including services and venue
2. **Admin review**: Administrator reviews the request
3. **Approval/Rejection**: Admin approves (creates event) or rejects the request
4. **Event management**: Approved events can be edited (new request) or cancelled

## Services

The system supports various event services that can be configured and selected:

- **Hospitality**: Food, drinks, cake, ice cream
- **Camera**: Photography services
- **Decoration**: Event decoration
- **Limousine**: Transportation services
- **Musical Band**: Live music

Each service has configurable costs and can be enabled/disabled per event.

## Project Structure

```
backend/
├─ config/
│  └─ services_config.js      # Service configurations
├─ controller/
│  ├─ admin_controller.js     # Admin logic
│  ├─ auth_controller.js      # Authentication logic
│  ├─ event_controller.js     # Event management logic
│  └─ user_controller.js      # User management logic
├─ middlewares/
│  └─ middlewares.js          # Authentication middleware
├─ model/
│  ├─ event_model.js          # Event data model
│  ├─ request_model.js        # Request data model
│  ├─ user_model.js           # User data model
│  └─ venue_model.js          # Venue data model
├─ routes/
│  ├─ admin_routes.js        # Admin routes
│  ├─ auth_routes.js          # Authentication routes
│  ├─ event_routes.js         # Event routes
│  ├─ services_routes.js      # Services routes
│  └─ user_routes.js          # User routes
├─ utils/
│  └─ jwt_helper.js           # JWT utility functions
├─ package.json
├─ server.js                  # Main server file
├─ swagger.json               # API documentation
└─ README.md                  # Project documentation
```

## Usage Examples

### User Registration

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123",
    "role": "user"
  }'
```

### User Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### Create Event Request

```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{
    "eventName": "Birthday Party",
    "eventDescription": "30th Birthday Celebration",
    "occasionType": "private",
    "eventDate": "2025-12-10",
    "eventTime": "20:00",
    "maxAttendance": 50,
    "eventType": "custom",
    "locationType": "lounge",
    "venueId": "692d541c55f354db0bec9f0a",
    "services": {
      "hospitality": {
        "enabled": true,
        "drinks": true,
        "food": true,
        "cake": true,
        "icecream": false
      },
      "camera": {
        "enabled": true
      },
      "decoration": {
        "enabled": true
      },
      "limousine": {
        "enabled": false
      },
      "musicalBand": {
        "enabled": false
      }
    }
  }'
```

### Get All Venues

```bash
curl -X GET http://localhost:3000/api/services/venues \
  -H "Authorization: Bearer your_jwt_token"
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add some feature'`)
5. Push to the branch (`git push origin feature/your-feature`)
6. Create a new Pull Request

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

---

© 2025 Event Management System. All rights reserved.
