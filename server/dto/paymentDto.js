class PaymentDTO {
    constructor(payment) {
      this.movement_id = payment.movement_id;
      this.payment_method = payment.payment_method;
      this.card_id = payment.card_id;
      this.paid = payment.paid;
      this._id = payment._id;
    }
  }
  
  module.exports = PaymentDTO;
  