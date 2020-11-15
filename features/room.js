class Room {
    roomId;
    ownerId;
    name;
    users;
    buzzTimeoutId;
    timerSetting;
    activeDrinkingSeconds;
    constructor(roomId, roomName, owner) {
        this.roomId = roomId;
        this.name = roomName;
        this.ownerId = owner.userId;
        this.users = {
            [owner.userId]: owner
        };
        this.timerSetting = 5000; // milliseconds
        this.activeDrinkingSeconds = 0;
    }
    addUser(user) {
        this.users = {
            ...this.users,
            [user.userId]: user
        };
    }
}

module.exports = Room;