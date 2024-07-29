copy config.json.example to your own config.json and fill your own credential values.

# Hotel API Testing Instructions

This README provides step-by-step instructions for testing the Hotel API and Room API endpoints using Postman or any other API testing tool.

## Setup

1. Install Postman (or your preferred API testing tool).
2. Create a new collection in Postman called "Hotel API".
3. Set up an environment variable:
    - Name: `baseUrl`
    - Value: `http://localhost:3000` (adjust if your server runs on a different port)

## Hotel Endpoints

### 1. Get All Hotels

-   **Method**: GET
-   **URL**: `{{baseUrl}}/hotel`
-   **Expected Response**: 200 OK with an array of hotel objects

### 2. Get Specific Hotel

-   **Method**: GET
-   **URL**: `{{baseUrl}}/hotel/luxury-suite-downtown` (replace with an actual hotel slug)
-   **Expected Response**: 200 OK with the hotel object, including its rooms

### 3. Create New Hotel

-   **Method**: POST
-   **URL**: `{{baseUrl}}/hotel`
-   **Headers**:
    -   Content-Type: application/json
-   **Body** (raw JSON):

    ```json
    {
      "slug": "new-test-hotel",
      "images": ["/images/hotels/new-test-hotel/main.jpg"],
      "title": "New Test Hotel",
      "description": "A test hotel for API testing",
      "guest_count": 2,
      "bedroom_count": 1,
      "bathroom_count": 1,
      "amenities": ["Wi-Fi", "TV"],
      "host_information": {"name": "Test Host", "phone": "1234567890"},
      "address": "123 Test St, Test City, 12345",
      "latitude": 40.7128,
      "longitude": -74.0060
    }

    # Room API Testing Instructions
    ```

This guide provides step-by-step instructions for testing the Room API endpoints using Postman or any other API testing tool.

## Setup

1. Install Postman (or your preferred API testing tool).
2. Create a new collection in Postman called "Room API".
3. Set up an environment variable:
    - Name: `baseUrl`
    - Value: `http://localhost:3000` (adjust if your server runs on a different port)

## Room Endpoints

### 1. Get All Rooms for a Hotel

-   **Method**: GET
-   **URL**: `{{baseUrl}}/hotel/:hotelSlug/rooms`
-   **Example**: `{{baseUrl}}/hotel/luxury-suite-downtown/rooms`
-   **Expected Response**: 200 OK with an array of room objects for the specified hotel

### 2. Get Specific Room

-   **Method**: GET
-   **URL**: `{{baseUrl}}/hotel/:hotelSlug/room/:roomSlug`
-   **Example**: `{{baseUrl}}/hotel/luxury-suite-downtown/room/deluxe-king`
-   **Expected Response**: 200 OK with the room object

### 3. Create New Room

-   **Method**: POST
-   **URL**: `{{baseUrl}}/hotel/:hotelSlug/room`
-   **Example**: `{{baseUrl}}/hotel/luxury-suite-downtown/room`
-   **Headers**:
    -   Content-Type: application/json
-   **Body** (raw JSON):
    ```json
    {
        "room_slug": "new-test-room",
        "room_image": "/images/rooms/new-test-room.jpg",
        "room_title": "New Test Room",
        "bedroom_count": 1
    }
    ```
