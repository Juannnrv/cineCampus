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