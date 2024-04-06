# AreaExplorer API Documentation

Welcome to the AreaExplorer API documentation. This API provides functionality for users to explore different areas and submit reviews. It also includes features for administrators to manage reviews efficiently. This documentation will guide you through the endpoints and their usage.

## Base URL

The base URL for accessing the API is: `https://areaexplorer.com/api/v1`

## Authentication

Authentication is required for certain endpoints. This is done using JSON Web Tokens (JWT). Upon successful authentication, the server will provide a token which should be included in the `Authorization` header of subsequent requests.

Example:
```
Authorization: Bearer <token>
```

## Endpoints

### User Endpoints

#### 1. Register User
- **URL:** `/users/register`
- **Method:** POST
- **Description:** Register a new user.
- **Request Body:**
  - `username`: String (required)
  - `email`: String (required)
  - `password`: String (required)
- **Response:**
  - `success`: Boolean
  - `message`: String

#### 2. Login User
- **URL:** `/users/login`
- **Method:** POST
- **Description:** Log in an existing user.
- **Request Body:**
  - `email`: String (required)
  - `password`: String (required)
- **Response:**
  - `success`: Boolean
  - `token`: String (JWT)
  - `message`: String

#### 3. Get User Dashboard
- **URL:** `/users/dashboard`
- **Method:** GET
- **Description:** Retrieve the dashboard of the authenticated user, including their reviews.
- **Authentication Required**
- **Response:**
  - `success`: Boolean
  - `reviews`: Array of Review Objects
  - `message`: String

### Review Endpoints

#### 1. Create Review
- **URL:** `/reviews/create`
- **Method:** POST
- **Description:** Create a new review.
- **Request Body:**
  - `areaName`: String (required)
  - `reviewContent`: String (required)
  - `rating`: Number (required, between 1 to 5)
- **Authentication Required**
- **Response:**
  - `success`: Boolean
  - `message`: String

#### 2. Get All Reviews
- **URL:** `/reviews`
- **Method:** GET
- **Description:** Retrieve all reviews.
- **Response:**
  - `success`: Boolean
  - `reviews`: Array of Review Objects
  - `message`: String

### Admin Endpoints

#### 1. Vet Review
- **URL:** `/admin/reviews/:reviewId/vet`
- **Method:** PUT
- **Description:** Approve or decline a review.
- **Authentication Required**
- **Request Body:**
  - `status`: String (required, "approved" or "declined")
- **Response:**
  - `success`: Boolean
  - `message`: String

## Example Usage

### Register User
```
POST https://areaexplorer.com/api/v1/users/register
{
  "username": "exampleUser",
  "email": "user@example.com",
  "password": "password123"
}
```

### Login User
```
POST https://areaexplorer.com/api/v1/users/login
{
  "email": "user@example.com",
  "password": "password123"
}
```
Response:
```
{
  "success": true,
  "token": "<JWT Token>",
  "message": "Login successful"
}
```

### Create Review
```
POST https://areaexplorer.com/api/v1/reviews/create
Authorization: Bearer <JWT Token>
{
  "areaName": "Example Area",
  "reviewContent": "This area is great for families!",
  "rating": 5
}
```
Response:
```
{
  "success": true,
  "message": "Review created successfully"
}
```
