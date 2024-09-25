const mongoose = require ("mongoose");
const Movie = require ("../models/movie");
const { handleAsync } = require("../middleware/handleAsync");

/**
 * Retrieve all movies from the database with their associated shows.
 *
 * This function uses the aggregation framework of MongoDB to perform a lookup (join) operation with the "show" collection.
 * It then groups the results by movie, and projects the required fields.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * 
 * @returns {void}
 * 
 * @throws {Error} When an error occurred during the retrieval of movies.
 * 
 * @example
 * // Usage of findAllMovies in a route
 * router.get('/movies', movieController.findAllMovies);
 */
exports.findAllMovies = async (req, res) => {
  const { result, err } = await handleAsync(() =>
    Movie.aggregate([
      {
        $lookup: {
          from: "show",
          localField: "_id",
          foreignField: "movie_id",
          as: "show_details"
        }
      },
      {
        $unwind: "$show_details"
      },
      {
        $group: {
          _id: "$_id",
          title: { $first: "$title" },
          genre: { $first: "$genre" }, 
          duration: { $first: "$duration" },
          cast: { $first: "$cast" }, 
          poster: { $first: "$poster" },
          trailer: { $first: "$trailer" },
          status: { $first: "$status" },
          show_dates: { $push: "$show_details.date" }
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
          genre: 1,
          duration: 1,
          cast: 1, 
          poster: 1,
          trailer: 1,
          status: 1,
          show_dates: {
            $cond: {
              if: {
                $gt: [{ $size: "$show_dates" }, 1]
              },
              then: "$show_dates",
              else: {
                $arrayElemAt: ["$show_dates", 0]
              }
            }
          }
        }
      }
    ])
  );

  if (err) {
    return res.status(500).json({
      message: err.message || "Some error occurred while retrieving movies.",
    });
  }

  if (!result) {
    return res.status(404).json({
      message: "Movies not found.",
    });
  }

  res.status(200).json(result);
};

/**
 * Retrieve a single movie from the database by ID.
 *
 * This function retrieves a movie by its ID. If the movie is not found, it sends a 404 status code.
 * If an error occurs during the retrieval, it sends a 500 status code.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * 
 * @returns {void}
 * 
 * @throws {Error} When an error occurred during the retrieval of the movie.
 * 
 * @example
 * // Usage of findOneMovie in a route
 * router.get('/movies/:id', movieController.findOneMovie);
 */
exports.findOneMovie = async (req, res) => {
  const { id } = req.params;
  const { result, err } = await handleAsync(() =>
      Movie.findById(id)
  );
  
  if (err) {
      return res.status(500).json({
          message: err.message || `Error retrieving movie with id=${id}`,
      });
  }
  
  if (!result) {
      return res.status(404).json({
          message: `Movie not found.`,
      });
  }
  
  res.status(200).json(result);
}
