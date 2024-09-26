const Show = require('../models/show');
const { handleAsync } = require('../middleware/handleAsync');
const mongoose = require('mongoose');

/**
 * Get available seats for the shows of a specific movie.
 * 
 * @param {Object} req - The request object.
 * @param {Object} req.params - The parameters in the request.
 * @param {string} req.params.id - The ID of the movie.
 * @param {Object} res - The response object.
 * 
 * @returns {Promise<void>} A promise that resolves to a response containing the available seats for the shows of the movie.
 * 
 * @throws {Error} If an error occurs while retrieving the seats from the database.
 * @throws {Error} If no shows are found for the given movie ID.
 */
exports.getSeatsAvailable = async (req, res) => {
    const { id } = req.params;

    const { result, err } = await handleAsync(() => Show.aggregate([
        {
          $match: {
            movie_id: new mongoose.Types.ObjectId(id),
            "available_seats.availability": true
          }
        },
        {
          $project: {
            _id: 1,
            date: 1,
            available_seats: 1
          }
        }
      ]));

    if (err) {
        return res.status(500).json({
            message: err.message || "Some error occurred while retrieving seats.",
        });
    }

    if (!result) {
        return res.status(404).json({
            message: "Show not found.",
        });
    }

    res.json(result);
}