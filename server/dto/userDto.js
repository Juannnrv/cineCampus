class UserDTO {
    constructor(user) {
        this._id = user._id;
        this.name = user.name;
        this.email = user.email;
        this.phone = user.phone;
        this.password = user.password;
        if (user.role) {
            this.role = user.role;
        }
        if (user.card_id) {
            this.card_id = user.card_id;
        }
    }
}

module.exports = UserDTO;