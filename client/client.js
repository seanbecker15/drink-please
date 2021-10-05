const socket = io();

let user, room;
let defRoomName = ''
const { pathname } = window.location;
if (pathname && pathname !== "" && pathname !== "/") {
    defRoomName = pathname.startsWith("/") ? pathname.substring(1) : pathname;
}

document.getElementsByName('room')[0].value = defRoomName;

socket.on('clear', function () {
    const buzzer = document.getElementById('buzzer');
    buzzer.className = 'buzzer inactive';
    document.getElementById('text').innerText = '';
    document.getElementById('buzzing-user').innerText = '';
});

socket.on('buzzing', function ({ name }) {
    const buzzer = document.getElementById('buzzer');
    buzzer.className = 'buzzer active';
    document.getElementById('text').innerText = 'Drink bitch ;)';
    document.getElementById('buzzing-user').innerText = name;
    const audio = new Audio('can-open.mp3');
    audio.play();
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
    document.getElementById('change-room').style.display = "block";
}

function showSubmitBtn() {
    document.getElementById('submit').style.display = "";
    document.getElementById('change-room').style.display = "none";
}

const profileKeys = {
    roomId: 'roomId',
    userId: 'userId',
}

function removeRoomInfo() {
    localStorage.removeItem(profileKeys.roomId);
}

function removeUserInfo() {
    localStorage.removeItem(profileKeys.userId);
}

socket.on('enterRoomDetails', () => {
    removeRoomInfo();
    document.getElementById('room').style.display = "block";
});


socket.on('enterUserDetails', () => {
    removeUserInfo();
    document.getElementById('name').style.display = "block";
});



socket.on('roomUpdate', ({room: newRoom}) => {
    // update room details
    const currentUserId = localStorage.getItem(profileKeys.userId);
    const currentUserName = newRoom.users[currentUserId].name;
    if (newRoom) {
        window.history.pushState({"html":"","pageTitle": `Buzzer - ${newRoom.name}`},"", `${window.location.origin}/${newRoom.name}`);
        document.getElementById('room-details-name').innerText = `Room: ${newRoom.name}`;
        document.getElementById('room-details-drink-secs').innerText = `Active drinking seconds: ${newRoom.activeDrinkingSeconds}`;
        document.getElementById('room-details-num-users').innerText = `Num users: ${Object.values(newRoom.users).filter(u => u.active).length}`;
        const userList = Object.values(newRoom.users)
            .filter(u => u.active)
            .sort((u1, u2) => {
                if (u1.name === currentUserName) { return -1; }
                if (u2.name === currentUserName) { return 1; }
                return u1.name.localeCompare(u2.name);
            })
            .map(u => {
                const className = (u.name === currentUserName) ? 'current-user' : '';
                return `<li class="${ className }">${ u.name }</li>`
            })
            .join('');
        document.getElementById('room-details-active-users').innerHTML = `<ul>${ userList }</ul>`;
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

function disconnect() {
    socket.emit('changeRoom', { roomId: room.roomId, userId: user.userId });
}

socket.on('disconnect', () => {
    if (room && user) {
        socket.emit('changeRoom', { roomId: room.roomId, userId: user.userId });
    }
})

document.getElementById('change-room').addEventListener("click", function (event) {
    event && event.stopPropagation && event.stopPropagation();
    removeRoomInfo();
    removeUserInfo();
    disconnect();
    showSubmitBtn();
})

