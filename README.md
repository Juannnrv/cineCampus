# Cine campus

CineCampus is an innovative platform designed to transform the movie-going experience. Aiming to offer a complete and personalized experience, allowing users to select movies, purchase tickets, assign seats and take advantage of exclusive discounts.

**Versión**: 1.0.0

**Author**: Juan Rosas

**Licency**: ISC

------

### System Requirements

To run this project, you need to have Node.js and npm installed on your machine. You can download Node.js from [nodejs.org](https://nodejs.org/), which includes npm.

------

### Scripts

- `dev:front`: 

  ```bash
  vite
  ```

  - Start the frontend development server using Vite.

- `dev:back`:

  ```bash
  node --env-file .env --watch server.js
  ```

  - Start the backend server in development mode, observing changes in the ``server.js`` file.

- `dev`:

  ```bash
  concurrently "npm run dev:front" "npm run dev:back"
  ```

  - Start both the frontend and backend servers concurrently in development mode.

- `build`:

  ```bash
  concurrently "vite build" "npm run dev:back"
  ```

  - Run the Vite build process for production and start the backend server.

- `preview`

  ```bash
  vite preview
  ```

  - Preview the production build locally.

------

### Enviroments variables 

To connect the application to the database and configure other sensitive parameters, you must create an `.env` file in the root of the project. Here is an example of environment variables you might need:
```
# MongoDB protocol and URI configuration

MONGO_PROTOCOLO=mongodb://
MONGO_USER=juan
MONGO_PSW=juan123
MONGO_HOST=10.0.0.193
MONGO_PORT=27017
MONGO_DB_NAME=cineCampus
JWT_SECRET=fa6c8dadf184b54901463d255e

```

### How to Configure

1. **Clone the repository**:

   ```
   git clone https://github.com/Juannnrv/cineCampus.git
   ```

2. **Install dependencies**:

   ```
   npm install
   ```

3. **Set environment variables**:

   Create an `.env` file in the root of the project and add the necessary environment variables (see previous section).

4. **Starts the server in build mode**:

   ```
   npm run build
   ```


## Login

**URL:** `http://localhost:5000/login/v1`

**Method:** POST

**Auth**: None

**Description:**  This endpoint authenticates a user using their credentials (username and password) and returns a JWT token. This token must be included in the `Authorization` header with the format `Bearer <token>` to access protected routes in the API.   

**Preconditions:** None. User must provide valid credentials.

**Request Body (JSON):**

```
{
  "name": "Lucario@example.com",
  "password": "Lucario"
}
```

**Responses:**

- **200 - Success:**

  **Description:** User has been authenticated successfully, and a JWT token has been generated.

  **Example Response (JSON):**

  ```
  {
    "message": "Logged on",
    "token": <token>
  }
  ```

- **400 - Bad Request:**

  **Description:** The request is missing required fields or the credentials are incorrect.

  **Example Response (JSON):**

  ```
  {
    "message": "missing credentials" // or "User not found" / "Invalid password"
  }
  ```

- **500 - Internal Server Error:**

  **Description:** An error occurred while processing the request or finding the user.

  **Example Response (JSON):**

  ```
  {
    "message": "Error finding user"
  }
  ```

## Database schema
  
![image](https://github.com/user-attachments/assets/28c15e88-6f65-4876-ad7e-6f5c75571c08)


## 1. Movie selection

### Get all movies

**URL:** `http://localhost:5000/movies/v1/`

**Method:** GET

**Auth**: True

**Description:** Retrieves a list of all movies in the database, including their associated show details.

**Preconditions:** The user must be registered and authenticated with a valid JWT

**Responses:**

- **200 - Success:**

  **Description:** The list of movies was successfully retrieved.

  **Example Response (JSON):**

  ```
  [
  {
    "_id": "66f35dcab20ac6f3207cbf26",
    "title": "The Fantastic Four: First Steps",
    "genre": [
      "Acción",
      "Ciencia Ficción"
    ],
    "duration": 128,
    "cast": [
      {
        "photo": "https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcRR6NpA5g8MC9AZFsy-wWhJv-1r3g8TM4tqlY1lGpsBA9ssyUJfEkauh5gzhggDJhH2oTeSx7o&s=19",
        "name": "Vanessa Kirby",
        "character": "Mujer Invisible"
      },
      {
        "photo": "https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcQDBMm4ESoJwqInpI1wrAiKL9VgNcER87EdOqlc0YFqAiXHoJAf9fvGvOCHO_q4KtBAKeBk7VRZ&s=19",
        "name": "Joseph Quinn",
        "character": "Johnny Storm"
      },
      {
        "photo": "https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcTdgPWnm7OGqVJyPfst8ya7kOhGkrJAJMdyXa3VOMA105Z6aAwU6kw8XrvZ8ba_nWuoAociAqaB&s=19",
        "name": "Pedro Pascal",
        "character": "Reed Richards"
      }
    ],
    "poster": "https://cdn.mos.cms.futurecdn.net/9PDw8goaTRi4hYgLhVaBtb-320-80.jpg",
    "trailer": "https://www.youtube.com/watch?v=GAE5v01t2cs",
    "status": "soon",
    "sinopsis": "Los cuatro fantásticos son un equipo de los cómics de Marvel. Integrados por Reed Richards, Sue y Johnny Storm, y Ben Grimm. Tras un accidente en el espacio los cuatro compañeros regresan a la tierra y comienzan a experimentar una serie de cambios que terminan por darles super poderes.",
    "show_dates": "2024-09-04T20:00:00.000Z"
  },
  {
    "_id": "66f49784cbdd85efc5a0d69c",
    "title": "Thunderbolts",
    "genre": [
      "Acción",
      "Ciencia Ficción"
    ],
    "duration": 148,
    "cast": [
      {
        "photo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTj53jwCF0UsmwEjBJEl_19hUk8YO0bEpiLF6jUGU5fMI1rES9rhx8DeY&s=10",
        "name": "Florence Pugh",
        "character": "Viuda Negra"
      },
      {
        "photo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3H7kyUcRD1RYloOqX2vxXjfj9ESXskDKk394-Q-lIULLTgXkMmBK0KJw&s=10",
        "name": "Geraldine Viswanathan",
        "character": "Mel"
      },
      {
        "photo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEF7nqWnTy0ssCJXMfBWTRm6-5YBD3JISkRdZJVV1xZJYWjdM9x3wZC7QF&s=10",
        "name": "Lewis Pullman",
        "character": "Sentry"
      }
    ],
    "poster": "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSt-ZkyfY_d0HcefSnABTQ5Rf4MHe67eGSEy8gn8eZEJYo7ikea",
    "trailer": "https://www.youtube.com/watch?v=yAlYcQiBuJ0",
    "status": "cartelera",
    "sinopsis": "Un grupo de villanos comandados por el peligroso Baron Zemo, que, buscando una redención por sus acciones, forma un equipo de antiguos criminales, enemigos de los Avengers, que operan en la clandestinidad, resolviendo misiones que, con la ausencia de varios superhéroes, nadie más puede resolver. ",
    "show_dates": "2024-09-08T15:00:00.000Z"
  }
  ]
  ```

- **400 - Bad Request:**

  **Description:** Invalid query parameters or missing data.

- **404 - Not Found:**

  **Description:** No movies were found in the database.

---

### Get a Movie by ID

**URL:** `http://localhost:5000/movies/v1/{id}`

**Method:** GET

**Description:** Retrieves the details of a specific movie by the provided ID.

**Preconditions:** The user must be registered and authenticated with a valid JWT

**Path Parameters:**

- **id (required):** The ID of the movie to be retrieved.

**Responses:**

- **200 - Success:**

  **Description:** The movie details were successfully retrieved.

  **Example Response (JSON):**

  ```
  {
  "_id": "66f35dcab20ac6f3207cbf26",
  "title": "The Fantastic Four: First Steps",
  "genre": [
    "Acción",
    "Ciencia Ficción"
  ],
  "duration": 128,
  "sinopsis": "The Marvel Comics superhero team created by Stan Lee and Jack Kirby. This quartet of superheroes consists of Mr. Fantastic, capable of stretching his body into incredible lengths and shapes, the Invisible Woman, who boasts invisibility as well as projecting powerful force fields, the Human Torch, capable of generating flames, surrounding himself with flames, and flying, and the Thing, who possesses superhuman strength and endurance due to the rock-like nature of his skin.",
  "poster": "https://cdn.mos.cms.futurecdn.net/9PDw8goaTRi4hYgLhVaBtb-320-80.jpg",
  "trailer": "https://www.youtube.com/watch?v=GAE5v01t2cs",
  "cast": [
    {
      "_id": "66f9ffee66836d452bb79dac",
      "photo": "https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcRR6NpA5g8MC9AZFsy-wWhJv-1r3g8TM4tqlY1lGpsBA9ssyUJfEkauh5gzhggDJhH2oTeSx7o&s=19",
      "name": "Vanessa Kirby",
      "character": "Mujer Invisible"
    },
    {
      "_id": "66f9ffee66836d452bb79dad",
      "photo": "https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcQDBMm4ESoJwqInpI1wrAiKL9VgNcER87EdOqlc0YFqAiXHoJAf9fvGvOCHO_q4KtBAKeBk7VRZ&s=19",
      "name": "Joseph Quinn",
      "character": "Johnny Storm"
    },
    {
      "_id": "66f9ffee66836d452bb79dae",
      "photo": "https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcTdgPWnm7OGqVJyPfst8ya7kOhGkrJAJMdyXa3VOMA105Z6aAwU6kw8XrvZ8ba_nWuoAociAqaB&s=19",
      "name": "Pedro Pascal",
      "character": "Reed Richards"
    }
  ],
  "status": "soon"
}
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

**Preconditions:** The user must be registered and authenticated with a valid JWT, be careful the show must exist with available seats.

**Request Body Parameters:**

- **user_id (required):** The ID of the user purchasing the ticket.
- **show_id (required):** The ID of the show for which tickets are being purchased.
- **date_movement (required):** The date and time of the show in ISO 8601 format.
- **seats (required):** An array of seat identifiers the user wishes to book.
- **card_id (optional):** The ID of the credit card to be used for the payment. If omitted, the payment will be processed as cash and card_id is gonna be null.

**Request Body (JSON):**

  ```
  { 
    "user_id": "64fcb97b7a6d9b2f40c5f3c8",
    "show_id": "79d0c4e68b819589635a1eb0",
    "date_movement": "2024-09-07T17:00:00Z",
    "status": "purchased",
    "seats": [
      "A1",
      "A2"
    ],
    "description": "Ticket purchase for movie",
    "card_id": "64fd00ab7a6d9b2f40c5f3d2"
  }
  ```

**Responses:**

- **200 - Success:**

  **Description:** The ticket was successfully purchased and the payment was processed.

  **Example Response (JSON):**

  ```
  {
    "message": "Ticket created successfully.",
    "ticket": {
      "user_id": "64fcb97b7a6d9b2f40c5f3c8",
      "show_id": "79d0c4e68b819589635a1eb0",
      "date_movement": "2024-09-07T17:00:00.000Z",
      "status": "purchased",
      "seats": [
        "A1",
        "A2"
      ],
      "description": "Ticket purchase for movie",
      "_id": "66d74ea3a8b17a5cf5eaa493"
    },
    "payment": {
      "movement_id": "66d74ea3a8b17a5cf5eaa493",
      "payment_method": "credit card",
      "card_id": "64fd00ab7a6d9b2f40c5f3d2",
      "paid": true,
      "_id": "66d74ea3a8b17a5cf5eaa496"
    },
    "card": {
      "name": "Premium Card",
      "discount": 10,
      "issueDate": "2024-02-01T00:00:00.000Z"
    }
  }
  ```

  **Example Response for non-specified credit card (JSON):**

  **Request Body (JSON):**

  ```
  {
    "user_id": "66d754820daf096ce6951bda",
    "show_id": "79d0c4e68b819589635a1eb0",
    "date_movement": "2024-09-07T17:00:00Z",
    "seats": [
      "A1"
    ],
    "description": ""
  }
  ```
  **Response**

  ```
  {
    "message": "Ticket created successfully.",
    "ticket": {
      "user_id": "66d754820daf096ce6951bda",
      "show_id": "79d0c4e68b819589635a1eb0",
      "date_movement": "2024-09-07T17:00:00.000Z",
      "status": "purchased",
      "seats": [
        "A1"
      ],
      "description": "",
      "_id": "66d756abe1bce70cdb91e6e4"
    },
    "payment": {
      "movement_id": "66d756abe1bce70cdb91e6e4",
      "payment_method": "credit card",
      "card_id": null,
      "paid": true,
      "_id": "66d756abe1bce70cdb91e6e7"
    },
    "card": {
      "name": "Standard Card",
      "validity": false,
      "discount": 5,
      "issueDate": "2024-01-15T00:00:00.000Z"
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

**Description:** Handles cases where a credit card provided does not match the user's credit card or is invalid, resulting in a declined payment and the availability of the chosen seats becoming available again.

**Preconditions:** The user must be registered and authenticated with a valid JWT, and the show must exist with available seats.

**Request Body Parameters:**

- **user_id (required):** The ID of the user attempting to purchase the ticket.
- **show_id (required):** The ID of the show for which tickets are being purchased.
- **date_movement (required):** The date and time of the show in ISO 8601 format.
- **seats (required):** An array of seat identifiers the user wishes to book.
- **card_id (required):** The ID of the credit card used for the payment attempt.

**Request Body (JSON):**

  ```
  {
    "user_id": "64fcb97b7a6d9b2f40c5f3cb",
    "show_id": "79d0c4e68b819589635a1eb0",
    "date_movement": "2024-09-07T17:00:00Z",
    "seats": [
      "A1"
    ],
    "description": "",
    "card_id": "64fd00ab7a6d9b2f40c5f3d2"
  }
  ```

**Responses:**

- **400 - Bad Request:**

  **Description:** The provided credit card does not belong to the user or is invalid.

  **Example Response for Card does not belong the user (JSON):**

  ```
  {
    "message": "Card doesn't belong to you. Payment rejected.",
    "ticket": {
      "user_id": "64fcb97b7a6d9b2f40c5f3ca",
      "show_id": "79d0c4e68b819589635a1eb0",
      "date_movement": "2024-09-07T17:00:00Z",
      "status": "rejected",
      "seats": [
        "A1", 
        "A2"
        ],
      "description": "Card doesn't belong to you."
      "id": "647cdefcd5d8a030b0d2e4f4",
    },
    "payment": {
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

  **Request Body (JSON):**

  ```
  {
    "user_id": "66d754820daf096ce6951bda",
    "show_id": "79d0c4e68b819589635a1eb0",
    "date_movement": "2024-09-07T17:00:00Z",
    "seats": [
      "A1"
    ],
    "description": "",
    "card_id": "64fd00ab7a6d9b2f40c5f3d1"
  }
  ```

**Response:**

  ```
  {
    "message": "Card is not valid. Payment rejected.",
    "ticket": {
      "user_id": "66d754820daf096ce6951bda",
      "show_id": "79d0c4e68b819589635a1eb0",
      "date_movement": "2024-09-07T17:00:00.000Z",
      "status": "rejected",
      "seats": [
        "A1"
      ],
      "description": "Card is not valid.",
      "_id": "66d754dee1bce70cdb91e6cc"
    },
    "payment": {
      "movement_id": "66d754dee1bce70cdb91e6cc",
      "payment_method": "credit card",
      "card_id": "64fd00ab7a6d9b2f40c5f3d1",
      "paid": false,
      "_id": "66d754dee1bce70cdb91e6cf"
    },
    "card": {
      "name": "Standard Card",
      "validity": false,
      "discount": 5,
      "issueDate": "2024-01-15T00:00:00.000Z"
    }
  }
  ```

### Get Available Seats

**URL:** `http://localhost:5000/shows/seats/v1/:id`

**Method:** GET

**Auth:** False

**Description:** Retrieves the available seats for a specific show. The response includes details of seats that are currently available, such as seat identifier, seat type, and price.

**Preconditions:** The user must be registered and authenticated with a valid JWT, and the show must exist in the database.

**Request Parameters:**

- **id (required):** The ID of the show for which available seats are being retrieved.

**Responses:**

- **200 - Success:**

  **Description:** Successfully retrieved the available seats for the specified show.

  **Example Response (JSON):**

  ```
  {
    "theater": {
      "name": "2D",
      "price": 10.95
    },
    "date": "2024-10-17",
    "time": "13:00",
    "showingIds": [
      "66f49d59cbdd85efc5a0d69e"
    ],
    "availableSeats": [
      {
        "seat": "A1",
        "availability": true,
        "seat_type": "standard",
        "price": 0
      },
      {
        "seat": "A2",
        "availability": false,
        "seat_type": "standard",
        "price": 0
      },
      {
        "seat": "A3",
        "availability": true,
        "seat_type": "standard",
        "price": 0
      },
      {
        "seat": "A4",
        "availability": false,
        "seat_type": "standard",
        "price": 0
      },
      {
        "seat": "A5",
        "availability": true,
        "seat_type": "standard",
        "price": 0
      },
      
        "seat": "C1",
        "availability": true,
        "seat_type": "standard",
        "price": 0
      },
      {
        "seat": "C2",
        "availability": false,
        "seat_type": "standard",
        "price": 0
      },
      {
        "seat": "C3",
        "availability": false,
        "seat_type": "standard",
        "price": 0
      },
      {
        "seat": "C4",
        "availability": false,
        "seat_type": "standard",
        "price": 0
      },
      {
        "seat": "C5",
        "availability": true,
        "seat_type": "standard",
        "price": 0
      },
      {
        "seat": "C6",
        "availability": true,
        "seat_type": "standard",
        "price": 0
      },
      {
        "seat": "C7",
        "availability": true,
        "seat_type": "standard",
        "price": 0
      },
      {
        "seat": "C8",
        "availability": true,
        "seat_type": "standard",
        "price": 0
      },
      {
        "seat": "C9",
        "availability": false,
        "seat_type": "standard",
        "price": 0
      },
      {
        "seat": "D1",
        "availability": true,
        "seat_type": "premium",
        "price": 50
      },
      {
        "seat": "D2",
        "availability": true,
        "seat_type": "premium",
        "price": 50
      },
      {
        "seat": "D3",
        "availability": true,
        "seat_type": "premium",
        "price": 50
      },
      {
        "seat": "D4",
        "availability": true,
        "seat_type": "premium",
        "price": 50
      },
      {
        "seat": "D5",
        "availability": true,
        "seat_type": "premium",
        "price": 50
      },
      {
        "seat": "D6",
        "availability": true,
        "seat_type": "premium",
        "price": 50
      },
      {
        "seat": "D7",
        "availability": true,
        "seat_type": "premium",
        "price": 50
      },
      {
        "seat": "D8",
        "availability": true,
        "seat_type": "premium",
        "price": 50
      },
      {
        "seat": "D9",
        "availability": true,
        "seat_type": "premium",
        "price": 50
      }
    ]
  },
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

## 3. Seat Allocation

### Book a Ticket

**URL:** `http://localhost:5000/tickets/book/v1`

**Method:** POST

**Auth:** True

**Description:** Allows a user to book seats for a specific show. If all selected seats are available, the booking is confirmed and the seats are marked as unavailable. If any of the selected seats are not available, the booking is placed on hold, and the seats remain available.

**Preconditions:** The user must be registered and authenticated with a valid JWT, and the show must exist with available seats.

**Request Body Parameters:**

- **user_id (required):** The ID of the user making the booking.
- **show_id (required):** The ID of the show for which the booking is being made.
- **date_movement (required):** The date and time of the booking in ISO 8601 format.
- **seats (required):** An array of seat identifiers the user wishes to book.
- **description (optional):** Optional description for the booking.

**Responses:**

- **200 - On Hold:**

  **Description:** Some or all of the selected seats are not available. The booking is put on hold, and the seats remain available.

  **Example Response (JSON):**

  ```
  {
    "message": "The following seats are not available: A1, B2. Your booking is on hold.",
    "ticket": {
      "id": "647cdefcd5d8a030b0d2e4f2",
      "user_id": "64fcb97b7a6d9b2f40c5f3c8",
      "show_id": "79d0c4e68b819589635a1eb0",
      "date_movement": "2024-09-07T17:00:00Z",
      "status": "on Hold",
      "seats": ["A1", "B2"],
      "description": "Ticket booking on hold due to seat unavailability."
    }
  }
  ```

- **201 - Success:**

  **Description:** All selected seats are available and successfully booked. The seats are marked as unavailable.

  **Example Response (JSON):**

  ```
  {
    "message": "Ticket booked successfully.",
    "ticket": {
      "id": "647cdefcd5d8a030b0d2e4f3",
      "user_id": "64fcb97b7a6d9b2f40c5f3c8",
      "show_id": "79d0c4e68b819589635a1eb0",
      "date_movement": "2024-09-07T17:00:00Z",
      "status": "booked",
      "seats": ["A1", "B2"],
      "description": "Ticket booked for show."
    }
  }
  ```

- **400 - Bad Request:**

  **Description:** Invalid or missing request parameters, or some selected seats are not available.

  **Example Response (JSON):**

  ```
  {
    "message": "The following seats are not available: A1, B2."
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

  ```
  {
    "message": "Show not found."
  }
  ```

- **500 - Internal Server Error:**

  **Description:** An error occurred while processing the request, typically related to database operations or server issues.

  **Example Response (JSON):**

  ```
  {
    "message": "Error creating or updating movement."
  }
  ```

### Cancel a Ticket

**URL:** `http://localhost:5000/tickets/cancel/v1/:movement_id`

**Method:** POST

**Auth:** True

**Description:** Cancels a booked or purchased ticket. The status of the ticket is updated to “cancelled” creating a new record of the cancellation and the associated seats become available for other bookings.

**Preconditions:** The user must be registered and authenticated with a valid JWT, and the ticket with the given `movement_id` must exist. The show associated with the ticket must also exist.

**Request Parameters:**

- **movement_id (required):** The ID of the ticket that needs to be cancelled.

**Responses:**

- **200 - Success:**

  **Description:** The ticket was successfully cancelled, and the seats were made available again.

  **Example Response (JSON):**

  ```
  {
    "message": "Ticket cancelled successfully.",
    "ticket": {
      "id": "647cdefcd5d8a030b0d2e4f2",
      "user_id": "64fcb97b7a6d9b2f40c5f3c8",
      "show_id": "79d0c4e68b819589635a1eb0",
      "date_movement": "2024-09-07T17:00:00Z",
      "status": "cancelled",
      "seats": ["A1", "A2"],
      "description": "Ticket was cancelled."
    }
  }
  ```

- **404 - Not Found:**

  **Description:** The specified ticket or show could not be found in the database.

  **Example Response (JSON):**

  ```
  {
    "message": "Ticket not found."
  }
  ```

  ```
  {
    "message": "Show not found."
  }
  ```

- **500 - Internal Server Error:**

  **Description:** An error occurred while processing the request, typically related to database operations or server issues.

  **Example Response (JSON):**

  ```
  {
    "message": "Error creating movement."
  }
  ```

  ```
  {
    "message": "Error updating show seats."
  }
  ```
## 5. User Management

### Create a New User

**URL:** `http://localhost:5000/users/v1/`

**Method:** POST

**Auth:** True

**Description:** Creates a new user in the system. If the role is 'admin', a `card_id` must be provided. If a `card_id` is provided, the user is created as a VIP user. Otherwise, the user is created with a 'user' role.

**Preconditions:** The user must be registered as an admin and authenticated with a valid JWT.

**Request Body Parameters:**

- **name (required):** The name of the user.
- **email (required):** The email of the user.
- **phone (required):** The phone number of the user.
- **password (required):** The password for the user account.
- **card_id (optional):** The card ID for VIP users. If provided, the user will be created with the role 'userVIP'.
- **role (required):** The role of the user (e.g., "user", "admin", "userVIP").

**Example Request (JSON):**

```
{
  "name": "Ivan",
  "email": "ivan.castañeda@gmail.com",
  "password": "Ivan",
  "phone": "12345678910"
}
```

**Responses:**

- **201 - Created:**

  **Description:** The user was successfully created.

  **Example Response (JSON):**

  ```
  {
    "message": "User created successfully",
    "user": {
      "_id": "64d0c4e68b819589635a1eb2",
      "name": "Ivan",
      "email": "ivan.castañeda@gmail.com",
      "phone": "12345678910",
      "role": "user"
    }
  }
  ```

- **400 - Bad Request:**

  **Description:** The request is missing required fields, or a required field does not meet the validation criteria. Additionally, if trying to create an admin without providing a `card_id`, this error will be returned.

  **Example Response (JSON):**

  ```
  {
    "message": "Cannot create user with role 'admin' without a card_id"
  }
  ```

- **500 - Internal Server Error:**

  **Description:** An error occurred while trying to create the user in the database.

  **Example Response (JSON):**

  ```
  {
    "message": "Error saving user",
    "error": "Database connection failed"
  }
  ```
### Get User Details by ID or Filter by Role

**URL:** `http://localhost:5000/users/v1`

**Method:** GET

**Auth:** True

**Description:** Retrieves the details of a user by their ID or filters users by role.

**Preconditions:** The user must be registered as an admin and authenticated with a valid JWT.

**Path Parameters:**

- **id (optional):** The ID of the user whose details are to be retrieved.

**Request Body:**

- **role (optional):** The role to filter users by.

**Responses:**

- **200 - Success:**

  **Description:** The user details were successfully retrieved or users were successfully filtered by role.

  **Example Response for Single User (JSON):**

  ```
  {
    "_id": "64d0c4e68b819589635a1eb2",
    "name": "Ivan",
    "email": "ivan.castañeda@gmail.com",
    "phone": "12345678910",
    "role": "user"
  }
  ```

  **Example Response for Multiple Users (JSON):**

  ```
  [
    {
      "_id": "64d0c4e68b819589635a1eb2",
      "name": "Ivan",
      "email": "ivan.castañeda@gmail.com",
      "phone": "12345678910",
      "role": "user"
    },
    {
      "_id": "64d0c4e68b819589635a1eb3",
      "name": "Maria",
      "email": "maria.gomez@gmail.com",
      "phone": "0987654321",
      "role": "user"
    }
  ]
  ```

  **400 - Bad Request:**

  **Description:** Neither ID nor role was provided in the request.

  **Example Response (JSON):**

  ```
  {
    "message": "ID or role is required"
  }	
  ```

  **404 - Not Found:**

  **Description:** The provided ID does not match any user in the database or no users match the provided role.

  **Example Response (JSON):**

  ```
  {
    "message": "User(s) not found"
  }
  ```

  **500 - Internal Server Error:**

  **Description:** An error occurred while trying to retrieve the user details from the database.

  **Example Response (JSON):**

  ```
  {
    "message": "User(s) not found",
    "error": "Database connection failed"
  }
  ```
  
### Update User Role

**URL:** `http://localhost:5000/users/v1/{id}

**Method:** PUT

**Auth:** True

**Description:** Updates the role of a user based on the provided role and card_id. Ensures the card is valid before assigning it.

**Preconditions:** The user must be registered as an admin and authenticated with a valid JWT.

**Path Parameters:**

- **id (required):** The ID of the user to update.

**Request Body:**

- **role (required):** The new role of the user (e.g., "admin", "userVIP", "user").
- **card_id (optional):** The card ID associated with the user, required for roles "admin" and "userVIP".

**Example Request:**

```
{
  "role": "userVIP",
  "card_id": "64fd00ab7a6d9b2f40c5f3d4"
}
```

**Responses:**

- **200 - Success:**

  **Description:** The user's role was successfully updated.

  **Example Response (JSON):**

  ```
  {
    "message": "userVIP updated successfully",
    "user": {
      "_id": "66d4d7a6d17889f49bfdcbfe",
      "name": "Jhon",
      "email": "jhon.lopez@gmail.com",
      "phone": "12345678910",
      "password": "Jhon",
      "role": "userVIP",
      "card_id": "64fd00ab7a6d9b2f40c5f3d4"
    }
  }
  ```

- **404 - Not Found:**

  **Description:** The provided user ID does not exist or the card ID is not found.

- **400 - Bad Request:**

  **Description:** Missing required data or invalid card ID provided.

- **500 - Internal Server Error:**

  **Description:** An error occurred while updating the user's role.
