const socket = require('socket.io');
const express = require('express'); 
const app = express();
const tasks = [];

const server = app.listen(8000, () => {
    console.log('Server is running on Port:', 8000)
});

app.use((req, res) => {
    res.status(404).send({ message: 'Not found...' });
});

const io = socket(server);

io.on('connection', (socket) => {
    console.log('New client! Its id – ' + socket.id);
    socket.on('message', () => { console.log('Oh, I\'ve got something from ' + socket.id) });
    console.log('I\'ve added a listener on message event \n');

    socket.broadcast.emit('updateData', tasks);

    socket.on('addTask', (task) => {
        tasks.push(task);
        socket.broadcast.emit('message', {author: 'Chat-Bot', content: 'task dodany'});
    });

    socket.on('removeTask', (id) => {
        socket.broadcast.emit('message', {author: 'Chat-Bot', content: 'task usunięty'});
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});