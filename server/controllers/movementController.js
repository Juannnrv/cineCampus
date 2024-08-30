const Payment = require("../models/payment");
const PaymentDTO = require("../dto/paymentDto");
const Movement = require("../models/movement");
const MovementDTO = require("../dto/movementDto");
const { handleAsync } = require("../middleware/handleAsync");
const User = require("../models/user");
const Show = require("../models/show");

exports.purchaseTicket = async (req, res) => {
  const {
    user_id,
    show_id,
    date_movement,
    seats,
    description,
    payment_method,
    card_id,
  } = req.body;

  // Buscar al usuario
  const { result: user, err: userErr } = await handleAsync(() =>
    User.findById(user_id)
  );
  if (userErr || !user) {
    return res.status(404).json({ message: "User not found." });
  }

  const { result, error } = await handleAsync(() =>
    Movement.create({
      user_id,
      show_id,
      date_movement,
      status: "on Hold",
      seats,
      description,
    })
  );

  if (error) {
    return res.status(500).json({
      message:
        error.message || "Some error occurred while creating the Movement.",
    });
  }

  const movement_id = result._id;

  const user_card = user.card_id;

  // Buscar el show
  const { result: show, err: showErr } = await handleAsync(() =>
    Show.findById(show_id)
  );
  if (showErr || !show) {
    return res.status(404).json({ message: "Show not found." });
  }

  // Actualizar asientos del show
  show.available_seats.forEach((seatShow) => {
    if (seats.includes(seatShow.name)) {
      seatShow.availability = false;
    }
  });

  const { err: showSaveErr } = await handleAsync(() => show.save());
  if (showSaveErr) {
    return res.status(500).json({ message: "Error updating show seats." });
  }

  // Caso 2: Validar card_id proporcionado
  if (card_id) {
    if (card_id.toString() !== user_card?.toString()) {
      // La tarjeta no pertenece al usuario -> Pago rechazado
      const rejectedMovement = new Movement({
        user_id,
        show_id,
        date_movement,
        status: "rejected",
        seats,
        description: "Card doesn't belong to you.",
      });

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
        card_id: user_card, // Usar el card_id del usuario para referencia
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
  }

  // Caso 1: El usuario no tiene tarjeta -> Pago en efectivo
  if (!user_card) {
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

  // Caso 3: Tarjeta válida -> Pago exitoso
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

  // Cambiar el estado del movimiento a "purchased"
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
