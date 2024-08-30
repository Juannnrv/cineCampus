class MovementDTO {
    constructor(movement) {
      this.user_id = movement.user_id;
      this.show_id = movement.show_id;
      this.date_movement = movement.date_movement;
      this.status = movement.status;
      this.seats = movement.seats;
      this.description = movement.description;
      this._id = movement._id;
    }
  }
  
  module.exports = MovementDTO;
  