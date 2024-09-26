const Show = require("../models/show");
const mongoose = require("mongoose");
const { handleAsync } = require("../middleware/handleAsync");

/**
 * Get available seats for the shows of a specific movie.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The parameters in the request.
 * @param {string} req.params.id - The ID of the movie.
 * @param {Object} req.query - The query parameters in the request.
 * @param {string} req.query.date - The date of the show in YYYY-MM-DD format.
 * @param {string} req.query.hour - The hour of the show in HH format.
 * @param {string} req.query.minute - The minute of the show in MM format.
 * @param {Object} res - The response object.
 *
 * @returns {Promise<void>} A promise that resolves to a response containing the available seats for the shows of the movie.
 *
 * @throws {Error} If an error occurs while retrieving the seats from the database.
 * @throws {Error} If no shows are found for the given movie ID and date/time.
 */
exports.getSeatsAvailable = async (req, res) => {
  const { id } = req.params;
  const { date, hour, minute } = req.query;

  const queryDate = new Date(`${date}T${hour}:${minute}:00.000Z`);

  const { result: shows, err } = await handleAsync(async () => {
    try {
      const shows = await Show.aggregate([
        {
          $match: {
            movie_id: new mongoose.Types.ObjectId(id), 
            date: { $gte: queryDate } 
          }
        },
        {
          $lookup: {
            from: 'theater', 
            localField: 'theater_id', 
            foreignField: '_id', 
            as: 'theaterDetails'
          }
        },
        {
          $unwind: {
            path: '$theaterDetails', 
            preserveNullAndEmptyArrays: false 
          }
        },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, 
              time: { $dateToString: { format: "%H:%M", date: "$date" } } 
            },
            showingIds: { $push: "$_id" }, 
            availableSeats: { $push: "$available_seats" },
            theater: { $first: "$theaterDetails" } 
          }
        },
        {
          $project: {
            _id: 0,
            date: "$_id.date",
            time: "$_id.time",
            showingIds: "$showingIds",
            availableSeats: {
              $reduce: {
                input: "$availableSeats",
                initialValue: [],
                in: { $concatArrays: ["$$value", "$$this"] }
              }
            },
            theater: { 
              name: "$theater.name",
              price: "$theater.price"
            }
          }
        },
        {
          $sort: { date: 1, time: 1 }
        }
      ]);

      if (!shows.length) {
        return res.status(404).json({
          message: "Show not found.",
        });
      }

      res.json(shows);
    } catch (err) {
      return res.status(500).json({
        message: err.message || "Some error occurred while retrieving seats.",
      });
    }
  });

  if (err) {
    return res.status(500).json({
      message: err.message || "Some error occurred while retrieving seats.",
    });
  }
};