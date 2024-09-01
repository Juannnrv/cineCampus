# Cine campus

## 1. Movie selection

### Get all movies

**URL:** `http://localhost:5000/movies/v1/`

**Method:** GET

**Auth**: True

**Description:** Retrieves a list of all movies in the database, including their associated show details.

**Preconditions:** The user must be registered.

**Responses:**

- **200 - Success:**

  **Description:** The list of movies was successfully retrieved.

  **Example Response (JSON):**

  ```
  [
    {
      "_id": "64d0c4e68b819589635a1eab",
      "title": "Garfield",
      "genre": [
        "Animation",
        "Comedy"
      ],
      "duration": 80,
      "show_dates": "2024-09-04T20:00:00.000Z"
    },
    {
      "_id": "64d0c4e68b819589635a1eac",
      "title": "Godzilla vs Kong",
      "genre": [
        "Action",
        "Adventure",
        "Sci-Fi"
      ],
      "duration": 113,
      "show_dates": "2024-09-05T16:00:00.000Z"
    },
    {
      "_id": "64d0c4e68b819589635a1ead",
      "title": "Kung Fu Panda 4",
      "genre": [
        "Animation",
        "Action",
        "Adventure"
      ],
      "duration": 95,
      "show_dates": "2024-09-06T19:00:00.000Z"
    },
    {
      "_id": "64d0c4e68b819589635a1eb2",
      "title": "Mufasa: The Lion King",
      "genre": [
        "Animation",
        "Adventure",
        "Drama"
      ],
      "duration": 105,
      "show_dates": "2024-09-02T21:00:00.000Z"
    }
  ]
  ```

- **400 - Bad Request:**

  **Description:** Invalid query parameters or missing data.

- **404 - Not Found:**

  **Description:** No movies were found in the database.

------

### Get a Movie by ID

**URL:** `http://localhost:5000/movies/v1/{id}`

**Method:** GET

**Description:** Retrieves the details of a specific movie by the provided ID.

**Preconditions:** The user must be registered.

**Path Parameters:**

- **id (required):** The ID of the movie to be retrieved.

**Responses:**

- **200 - Success:**

  **Description:** The movie details were successfully retrieved.

  **Example Response (JSON):**

  ```
  {
    "_id": "64d0c4e68b819589635a1eb2",
    "title": "Mufasa: The Lion King",
    "duration": 105,
    "synopsis": "Explore the story of King Mufasa, father of Simba, in a new adventure that delves into the past of the lion king."
  }
  ```

- **404 - Not Found:**

  **Description:** The provided ID does not match any movie in the database.

  **Example Response (JSON):**

  ```
  {
    "message": "Movie not found."
  }
  ```

- **400 - Bad Request:**

  **Description:** The provided ID is invalid.

## 2. Ticket Purchase

### Purchase a Ticket

**URL:** `http://localhost:5000/tickets/purchase/v1`

**Method:** POST

**Auth:** True

**Description:** Allows a user to purchase a ticket for a specific show. Depending on whether a credit card is provided, the ticket may be paid immediately or handled as a cash transaction.

**Preconditions:** The user must be registered, and the show must exist with available seats.

**Request Body Parameters:**

- **user_id (required):** The ID of the user purchasing the ticket.
- **show_id (required):** The ID of the show for which tickets are being purchased.
- **date_movement (required):** The date and time of the show in ISO 8601 format.
- **seats (required):** An array of seat identifiers the user wishes to book.
- **card_id (optional):** The ID of the credit card to be used for the payment. If omitted, the payment will be processed as cash.

**Responses:**

- **200 - Success:**

  **Description:** The ticket was successfully purchased and the payment was processed.

  **Example Response (JSON):**

  ```
  {
    "message": "Ticket created successfully.",
    "ticket": {
      "id": "647cdefcd5d8a030b0d2e4f2",
      "user_id": "64fcb97b7a6d9b2f40c5f3c8",
      "show_id": "79d0c4e68b819589635a1eb0",
      "date_movement": "2024-09-07T17:00:00Z",
      "status": "purchased",
      "seats": ["A1", "A2"],
      "description": "Ticket purchase for movie"
    },
    "payment": {
      "id": "647cdefcd5d8a030b0d2e4f3",
      "movement_id": "647cdefcd5d8a030b0d2e4f2",
      "payment_method": "credit card",
      "card_id": "64fd00ab7a6d9b2f40c5f3d2",
      "paid": true
    }
  }
  ```

- **400 - Bad Request:**

  **Description:** Invalid or missing request parameters, or the selected seats are not available.

  **Example Response (JSON):**

  ```
  {
    "message": "The following seats are not available: A1, A2."
  }
  ```

- **404 - Not Found:**

  **Description:** The specified user or show could not be found in the database.

  **Example Response (JSON):**

  ```
  {
    "message": "User not found."
  }
  ```

- **500 - Internal Server Error:**

  **Description:** An error occurred while processing the request, typically related to database operations or server issues.

  **Example Response (JSON):**

  ```
  {
    "message": "Error creating or updating movement/payment."
  }
  ```

### Purchase Rejected Due to Invalid Credit Card

**URL:** `http://localhost:5000/tickets/v1/purchase`

**Method:** POST

**Auth:** True

**Description:** Handles cases where a credit card provided does not match the user's credit card, resulting in a declined payment and the availability of the chosen seats becoming available again.

**Preconditions:** The user must be registered, and the show must exist with available seats.

**Request Body Parameters:**

- **user_id (required):** The ID of the user attempting to purchase the ticket.
- **show_id (required):** The ID of the show for which tickets are being purchased.
- **date_movement (required):** The date and time of the show in ISO 8601 format.
- **seats (required):** An array of seat identifiers the user wishes to book.
- **card_id (required):** The ID of the credit card used for the payment attempt.

**Responses:**

- **400 - Bad Request:**

  **Description:** The provided credit card does not belong to the user.

  **Example Response (JSON):**

  ```
  {
    "message": "Card doesn't belong to you. Payment rejected.",
    "ticket": {
      "id": "647cdefcd5d8a030b0d2e4f4",
      "user_id": "64fcb97b7a6d9b2f40c5f3ca",
      "show_id": "79d0c4e68b819589635a1eb0",
      "date_movement": "2024-09-07T17:00:00Z",
      "status": "rejected",
      "seats": ["A1", "A2"],
      "description": "Card doesn't belong to you."
    },
    "payment": {
      "id": "647cdefcd5d8a030b0d2e4f5",
      "movement_id": "647cdefcd5d8a030b0d2e4f4",
      "payment_method": "credit card",
      "card_id": "64fd00ab7a6d9b2f40c5f3d2",
      "paid": false
      "id": "647cdefcd5d8a030b0d2e4f5",
    },
    "card": {}
  }
  ```

  **Example Response for Invalid Card (JSON):**

  ```
  {
    "message": "Card is not valid. Payment rejected.",
    "ticket": {
      "user_id": "64fcb97b7a6d9b2f40c5f3c8",
      "show_id": "79d0c4e68b819589635a1eb0",
      "date_movement": "2024-09-07T17:00:00.000Z",
      "status": "rejected",
      "seats": [
      "A1",
      "A2"
      ],
      "description": "Card is not valid.",
      "id": "66d4a4a2c146980c2e8da3c8"
    },
    "payment": {
      "movement_id": "66d4a4a2c146980c2e8da3c8",
      "payment_method": "credit card",
      "card_id": "64fd00ab7a6d9b2f40c5f3d2",
      "paid": false,
      "id": "66d4a4a2c146980c2e8da3cb"
    },
    "card": {
      "name": "Premium Card",
      "validity": false,
      "discount": 10
    }
  }
  ```

### Get Available Seats

**URL:** `http://localhost:5000/shows/seats/v1/:id`

**Method:** GET

**Auth:** False

**Description:** Retrieves the available seats for a specific show. The response includes details of seats that are currently available, such as seat identifier, seat type, and price.

**Preconditions:** The show must exist in the database.

**Request Parameters:**

- **id (required):** The ID of the show for which available seats are being retrieved.

**Responses:**

- **200 - Success:**

  **Description:** Successfully retrieved the available seats for the specified show.

  **Example Response (JSON):**

  ```
  [
    {
      "seat": "A1",
      "seat_type": "Standard",
      "price": 15.00
    },
    {
      "seat": "A2",
      "seat_type": "Standard",
      "price": 15.00
    }
  ]
  ```

- **404 - Not Found:**

  **Description:** The show with the specified ID could not be found.

  **Example Response (JSON):**

  ```
  {
    "message": "Show not found."
  }
  ```

- **500 - Internal Server Error:**

  **Description:** An error occurred while retrieving the seats from the database.

  **Example Response (JSON):**

  ```
  {
    "message": "Some error occurred while retrieving movies."
  }
  ```