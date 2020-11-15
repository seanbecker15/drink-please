class Room {
    roomId;
    ownerId;
    name;
    users;
    buzzInterval;
    timerSetting;
    constructor(roomId, roomName, owner) {
        this.roomId = roomId;
        this.name = roomName;
        this.ownerId = owner.userId;
        this.users = {
            [owner.userId]: owner
        };
        this.timerSetting = 5000; // milliseconds
    }
    addUser(user) {
        this.users = {
            ...this.users,
            [user.userId]: user
        };
    }
}

module.exports = Room;