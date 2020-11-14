const socket = io();

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

function buzz() {
    console.log('buzzing');
    socket.emit('buzz');
}

window.onkeydown(() => {
    socket.emit('buzz');
});