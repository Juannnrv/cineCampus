const Show = require('../models/show');
const { handleAsync } = require('../middleware/handleAsync');
const mongoose = require('mongoose');

/**
 * Get available seats for a specific show.
 * 
 * @param {Object} req - The request object.
 * @param {Object} req.params - The parameters in the request.
 * @param {string} req.params.id - The ID of the show.
 * @param {Object} res - The response object.
 * 
 * @returns {Promise<Object>} A promise that resolves to an object containing the available seats for the show.
 * 
 * @throws {Error} If an error occurs while retrieving the seats from the database.
 * @throws {Error} If the show with the given ID is not found.
 */
exports.getSeatsAvailable = async (req, res) => {
    const { id } = req.params;

    const { result, err } = await handleAsync(() => Show.aggregate([
        {
            $unwind: "$available_seats",
        },
        {
            $match: {
                "available_seats.availability": true,
                _id: new mongoose.Types.ObjectId(id),
            },
        },
        {
            $project: {
                _id: 0,
                seat: "$available_seats.seat",
                seat_type: "$available_seats.seat_type",
                price: "$available_seats.price",
            },
        },
    ]));

    if (err) {
        return res.status(500).json({
            message: err.message || "Some error occurred while retrieving movies.",
        });
    }

    if (!result) {
        return res.status(404).json({
            message: "Show not found.",
        });
    }

    res.json(result);

}
