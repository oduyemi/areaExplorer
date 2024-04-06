## Area Explorer API Documentation

### Overview

The Area Explorer API provides endpoints to manage user accounts, reviews, and administrative tasks for the Area Explorer web application. It allows users to register, log in, post reviews, update their profiles, and more.

### Base URL

```
https://areaexplorer-api.onrender.com
```

### Authentication

The API uses JSON Web Tokens (JWT) for authentication. Users and administrators must include their JWT token in the `Authorization` header of each request.

Example:
```
Authorization: Bearer <token>
```

### Endpoints

#### Users

- **POST /users/register**
  - Registers a new user account.
    - Request Body:
      ```json
      {
        "fname": "John",
        "lname": "Doe",
        "email": "john.doe@example.com",
        "phone": "1234567890",
        "password": "password123"
      }
      ```
    - Response:
      ```json
      {
        "message": "User registered successfully.",
        "token": "<jwt_token>",
        "nextStep": "/next-login-page"
      }
      ```

- **POST /users/login**
  - Logs in an existing user.
    - Request Body:
      ```json
      {
        "email": "john.doe@example.com",
        "password": "password123"
      }
      ```
    - Response:
      ```json
      {
        "message": "User login successful!.",
        "nextStep": "/next-dashboard",
        "token": "<jwt_token>"
      }
      ```

- **PUT /users/:userId**
  - Updates the details of the user with the specified ID.
    - Request Parameters:
      - `userId`: ID of the user to be updated.
    - Request Body (Optional):
      ```json
      {
        "fname": "John",
        "lname": "Doe",
        "email": "john.doe@example.com",
        "phone": "1234567890"
      }
      ```
    - Response:
      ```json
      {
        "message": "User details updated successfully"
      }
      ```

- **PUT /users/:userId/resetpassword**
  - Resets the password for the user with the specified ID.
    - Request Parameters:
      - `userId`: ID of the user to reset password for.
    - Request Body:
      ```json
      {
        "oldPassword": "oldpassword123",
        "newPassword": "newpassword123",
        "confirmNewPassword": "newpassword123"
      }
      ```
    - Response:
      ```json
      {
        "message": "Password reset successfully"
      }
      ```

- **DELETE /users/:userId/delete**
  - Deletes the user account with the specified ID.
    - Request Parameters:
      - `userId`: ID of the user to be deleted.
    - Response:
      ```json
      {
        "message": "User account deleted successfully"
      }
      ```

#### Admins

- **POST /admin/register**
  - Registers a new admin account.
    - Request Body:
      ```json
      {
        "fname": "John",
        "lname": "Doe",
        "email": "john.doe@example.com",
        "phone": "1234567890",
        "password": "password123"
      }
      ```
    - Response:
      ```json
      {
        "message": "Admin registered successfully.",
        "token": "<jwt_token>",
        "nextStep": "/next-login-page"
      }
      ```

- **POST /admin/login**
  - Logs in an existing admin.
    - Request Body:
      ```json
      {
        "email": "john.doe@example.com",
        "password": "password123"
      }
      ```
    - Response:
      ```json
      {
        "message": "Admin login successful!.",
        "nextStep": "/next-dashboard",
        "token": "<jwt_token>"
      }
      ```

- **PUT /admin/:adminId**
  - Updates the details of the admin with the specified ID.
    - Request Parameters:
      - `adminId`: ID of the admin to be updated.
    - Request Body (Optional):
      ```json
      {
        "fname": "John",
        "lname": "Doe",
        "email": "john.doe@example.com",
        "phone": "1234567890"
      }
      ```
    - Response:
      ```json
      {
        "message": "User details updated successfully"
      }
      ```

- **PUT /admin/:adminId/resetpassword**
  - Resets the password for the user with the specified ID.
    - Request Parameters:
      - `adminId`: ID of the admin to reset password for.
    - Request Body:
      ```json
      {
        "oldPassword": "oldpassword123",
        "newPassword": "newpassword123",
        "confirmNewPassword": "newpassword123"
      }
      ```
    - Response:
      ```json
      {
        "message": "Password reset successfully"
      }
      ```

- **DELETE /admin/:adminId/delete**
  - Deletes the admin account with the specified ID.
    - Request Parameters:
      - `adminId`: ID of the admin to be deleted.
    - Response:
      ```json
      {
        "message": "Admin account deleted successfully"
      }
      ```
      
- **POST /admin/reviews/:reviewId/approve**
  - Allows admin to approve a review.
    - Response:
      ```json
        {
        "message": "Review approved successfully"
      }

      ```

- **POST /admin/reviews/:reviewId/decline**
  - Allows admin to decline a review.
    - Response:
      ```json
        {
        "message": "Review declined successfully"
      }

      ```

  - **GET /admin/reviews/approve**
  - Allows admin to retrieve an approved review.
    - Response:
      ```json
        {
          "reviewID": "1234567890",
          "reviewStatus": "approved",
          "date": "2024-04-07T10:30:00.000Z"
        },

      ```

- **GET /admin/reviews/decline**
  - Allows admin to fetch a declined review.
    - Response:
      ```json
        {
          "reviewID": "1234567890",
          "reviewStatus": "declined",
          "date": "2024-04-07T10:30:00.000Z"
        },

      ```

### Reviews

Reviews allow users to share their experiences and opinions about different areas.

- **GET /reviews**
  - Retrieves all reviews.
    - Response:
      ```json
      [
        {
          "reviewID": "1234567890",
          "userID": "0987654321",
          "areaName": "Example Area",
          "reviewContent": "This area is great for families!",
          "rating": "5",
          "status": "approved",
          "date": "2024-04-07T10:30:00.000Z"
        },
        {
          "reviewID": "0987654321",
          "userID": "1234567890",
          "areaName": "Another Area",
          "reviewContent": "Not recommended for pet owners.",
          "rating": "2",
          "status": "approved",
          "date": "2024-04-06T15:45:00.000Z"
        }
      ]
      ```

- **GET /reviews/:reviewId**
  - Retrieves the review with the specified ID.
    - Request Parameters:
      - `reviewId`: ID of the review to retrieve.
    - Response:
      ```json
      {
        "reviewID": "1234567890",
        "userID": "0987654321",
        "areaName": "Example Area",
        "reviewContent": "This area is great for families!",
        "rating": "5",
        "status": "approved",
        "date": "2024-04-07T10:30:00.000Z"
      }
      ```

- **POST /reviews**
  - Posts a new review.
    - Request Body:
      ```json
      {
        "areaName": "Example Area",
        "reviewContent": "This area is great for families!",
        "rating": "5"
      }
      ```
    - Response:
      ```json
      {
        "message": "Review posted successfully"
      }
      ```

- **PUT /reviews/:reviewId**
  - Updates the details of the review with the specified ID.
    - Request Parameters:
      - `reviewId`: ID of the review to update.
    - Request Body (Optional):
      ```json
      {
        "areaName": "Updated Area Name",
        "reviewContent": "Updated review content",
        "rating": "4"
      }
      ```
    - Response:
      ```json
      {
        "message": "Review details updated successfully"
      }
      ```

- **DELETE /reviews/:reviewId/delete**
  - Deletes the review with the specified ID.
    - Request Parameters:
      - `reviewId`: ID of the review to delete.
    - Response:
      ```json
      {
        "message": "Review deleted successfully"
      }
      ```

---



