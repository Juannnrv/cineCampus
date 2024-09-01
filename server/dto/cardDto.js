class CardDTO {
    constructor(card) {
        this.name = card.name;
        this.validity = card.validity;
        this.discount = card.discount;
        this.issueDate = card.issueDate;
    }
}

module.exports = CardDTO;