const socket = io();

let user, room;

socket.on('clear', function () {
    const buzzer = document.getElementById('buzzer');
    buzzer.className = 'buzzer inactive';
    document.getElementById('text').innerText = '';
});

socket.on('buzzing', function () {
    const buzzer = document.getElementById('buzzer');
    buzzer.className = 'buzzer active';
    document.getElementById('text').innerText = 'Drink bitch ;)';
});

const buzz = () => {
    if (user && room) {
        console.log('buzzing');
        socket.emit('buzz', { userName: user.name, roomId: room.roomId });
    }
}

document.addEventListener("keydown", () => {
    buzz();
});

function hideSubmitBtn() {
    document.getElementById('submit').style.display = "none";
}

function showSubmitBtn() {
    document.getElementById('submit').style.display = "block";
}

const profileKeys = {
    roomId: 'roomId',
    userId: 'userId',
}

socket.on('enterRoomDetails', () => {
    localStorage.removeItem(profileKeys.roomId);
    document.getElementById('room').style.display = "block";
});


socket.on('enterUserDetails', () => {
    localStorage.removeItem(profileKeys.userId);
    document.getElementById('name').style.display = "block";
});



socket.on('roomUpdate', ({room: newRoom}) => {
    // update room details
    if (newRoom) {
        document.getElementById('room-details').innerText = `Room: ${newRoom.name}`;
        localStorage.setItem(profileKeys.roomId, newRoom.roomId);
        document.getElementById('room').style.display = "none";
        hideSubmitBtn();
        console.log(newRoom);
        room = newRoom;
    }
})

socket.on('userUpdate', ({user: newUser}) => {
    // update user details
    if (newUser) {
        document.getElementById('user-details').innerText = `Display Name: ${newUser.name}`;
        localStorage.setItem(profileKeys.userId, newUser.userId);
        document.getElementById('name').style.display = "none";
        console.log(newUser);
        user = newUser;
    }
})

function joinRoom(userName, roomName) {
    socket.emit('joinRoom', { userName, roomName });
}

function onSubmit() {
    const uEl = document.getElementsByName('name')[0];
    const rEl = document.getElementsByName('room')[0];
    joinRoom(uEl.value, rEl.value);
}

function retrieveStorage(key) {
    return localStorage.getItem(key);
}



function attemptReconnect() {
    // get previous profile settings
    const roomId = retrieveStorage(profileKeys.roomId);
    const userId = retrieveStorage(profileKeys.userId);
    console.log('reconnecting...', { roomId, userId })
    socket.emit('reconnect', { roomId, userId });
}

attemptReconnect();