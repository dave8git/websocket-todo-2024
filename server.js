const socket = require('socket.io');
const express = require('express'); 
const app = express();
let tasks = []; // Make sure it's mutable

const server = app.listen(8000, () => {
    console.log('Server is running on Port:', 8000);
});

const io = socket(server);

io.on('connection', (socket) => {
    console.log('New client! Its id – ' + socket.id);

    socket.emit('updateData', tasks);

    socket.on('addTask', (task) => {
        tasks.push(task); 
        io.emit('addTask', task);
    });

    socket.on('removeTask', (taskId) => {
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1); 
            io.emit('removeTask', taskId);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

app.use((req, res) => {
    res.status(404).send({ message: 'Not found...' });
});