const Payment = require("../models/payment");
const PaymentDTO = require("../dto/paymentDto");
const Movement = require("../models/movement");
const MovementDTO = require("../dto/movementDto");
const { handleAsync } = require("../middleware/handleAsync");
const User = require("../models/user");
const Show = require("../models/show");

/** 
 * @function purchaseTicket
 * @description Purchase a ticket for a show. If the user provides a card_id, it must match the user's card_id. If no card_id is provided and the user has no card, the payment is made in cash. Otherwise, the ticket is put on hold until the payment is made.
 * @async
 * @method
 * @param {Object} req - HTTP request object containing the ticket data in `req.body`.
 * @param {Object} res - HTTP response object to send the response to the client.
 * @returns {void}
 * @throws {Error} Throws an error if the ticket purchase fails.
 * @response {Object} Responds with the created ticket if successful.
 * @response {Object} Responds with an error message if the purchase fails.
 */
exports.purchaseTicket = async (req, res) => {
  const {
    user_id,
    show_id,
    date_movement,
    seats,
    description,
    card_id,
  } = req.body;

  const { result: user, err: userErr } = await handleAsync(() =>
    User.findById(user_id)
  );
  if (userErr || !user) {
    return res.status(404).json({ message: "User not found." });
  }

  const { result: show, err: showErr } = await handleAsync(() =>
    Show.findById(show_id)
  );
  if (showErr || !show) {
    return res.status(404).json({ message: "Show not found." });
  }

  const unavailableSeats = seats.filter((seat) => {
    const seatShow = show.available_seats.find((s) => s.seat === seat);
    return seatShow && !seatShow.availability;
  });

  if (unavailableSeats.length > 0) {
    return res.status(400).json({
      message: `The following seats are not available: ${unavailableSeats.join(", ")}.`,
    });
  }

  show.available_seats.forEach((seatShow) => {
    if (seats.includes(seatShow.seat)) {
      seatShow.availability = false;
    }
  });

  const { err: showSaveErr } = await handleAsync(() => show.save());
  if (showSaveErr) {
    return res.status(500).json({ message: "Error updating show seats." });
  }

  const user_card = user.card_id;

  if (card_id) {
    if (card_id.toString() !== user_card?.toString()) {
      const rejectedMovement = new Movement({
        user_id,
        show_id,
        date_movement,
        status: "rejected",
        seats,
        description: "Card doesn't belong to you.",
      });

      show.available_seats.forEach((seatShow) => {
        if (seats.includes(seatShow.seat)) {
          seatShow.availability = true;
        }
      });

      const { err: showSaveErr } = await handleAsync(() => show.save());
      if (showSaveErr) {
        return res.status(500).json({ message: "Error updating show seats." });
      }


      const { err: rejectedMovementSaveErr } = await handleAsync(() =>
        rejectedMovement.save()
      );
      if (rejectedMovementSaveErr) {
        return res.status(500).json({
          message: "Error creating rejected movement.",
        });
      }

      const payment = new Payment({
        movement_id: rejectedMovement._id,
        payment_method: "credit card",
        card_id: user_card,
        paid: false,
      });

      const { err: paymentSaveErr } = await handleAsync(() => payment.save());
      if (paymentSaveErr) {
        return res.status(500).json({ message: "Error updating payment." });
      }

      return res.status(400).json({
        message: "Card doesn't belong to you. Payment rejected.",
        ticket: new MovementDTO(rejectedMovement),
        payment: new PaymentDTO(payment),
      });
    }
  } else if (!user_card) {
    const purchasedMovement = new Movement({
      user_id,
      show_id,
      date_movement,
      status: "purchased",
      seats,
      description: "Payment was done in cash because no credit card available.",
    });

    const { err: purchasedMovementSaveErr } = await handleAsync(() =>
      purchasedMovement.save()
    );
    if (purchasedMovementSaveErr) {
      return res.status(500).json({
        message: "Error creating purchased movement.",
      });
    }

    const payment = new Payment({
      movement_id: purchasedMovement._id,
      payment_method: "cash",
      card_id: null,
      paid: true,
    });

    const { err: paymentSaveErr } = await handleAsync(() => payment.save());
    if (paymentSaveErr) {
      return res.status(500).json({ message: "Error updating payment." });
    }

    return res.status(201).json({
      message: "Ticket created successfully (paid in cash).",
      ticket: new MovementDTO(purchasedMovement),
      payment: new PaymentDTO(payment),
    });
  }

  const movementOnHold = new Movement({
    user_id,
    show_id,
    date_movement,
    status: "on Hold",
    seats,
    description,
  });

  const { err: movementSaveErr } = await handleAsync(() =>
    movementOnHold.save()
  );
  if (movementSaveErr) {
    return res.status(500).json({ message: "Error creating movement." });
  }

  movementOnHold.status = "purchased";

  const { err: movementUpdateErr } = await handleAsync(() =>
    movementOnHold.save()
  );
  if (movementUpdateErr) {
    return res.status(500).json({ message: "Error updating movement." });
  }

  const payment = new Payment({
    movement_id: movementOnHold._id,
    payment_method: "credit card",
    card_id,
    paid: true,
  });

  const { err: paymentSaveErr } = await handleAsync(() => payment.save());
  if (paymentSaveErr) {
    return res.status(500).json({ message: "Error updating payment." });
  }

  res.status(201).json({
    message: "Ticket created successfully.",
    ticket: new MovementDTO(movementOnHold),
    payment: new PaymentDTO(payment),
  });
};
