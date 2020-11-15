class User {
    userId;
    name;
    active;
    constructor(userId, name) {
        this.userId = userId;
        this.name = name;
        this.active = true;
    }
}

module.exports = User;