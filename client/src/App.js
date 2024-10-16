import io from 'socket.io-client';
import shortid from 'shortid';
import { useState, useEffect } from 'react';

const App = () => {
  const [socket, setSocket] = useState(null); 
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const randomId = shortid(); 

  useEffect(() => {
    const socket = io('ws://localhost:8000', { transports: ['websocket'] });
    setSocket(socket);

    socket.on('addTask', (task) => addTask(task));
    socket.on('removeTask', (id) => removeTaskLocal(id));
    socket.on('updateData', (tasks) => setTasks(tasks));

    return () => {
      socket.disconnect(); 
    };
  }, []);

  function removeTaskLocal(taskId) {
    setTasks(tasks => tasks.filter(task => task.id !== taskId ));
  }

  function removeTask(taskId) {
    if (socket) {
      socket.emit('removeTask', taskId);
    }
  }

  function submitForm(e) {
    e.preventDefault(); 
    const newTask = { name: taskName, id: randomId };
    if (socket) {
      socket.emit('addTask', newTask);
    }
  }

  function handleInputForm(e) {
    setTaskName(e.target.value);
  }

  function addTask(task) {
    setTasks(tasks => [...tasks, task]);
  }

  return (
    <div className="App">
      <header>
        <h1>ToDoList.app</h1>
      </header>
      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>
        <ul className="tasks-section__list" id="tasks-list">
          {tasks.map((task) => 
              <li className="task" key={task.id}>
                {task.name}
                <button className="btn btn--red" onClick={() => removeTask(task.id)}>Remove</button>
              </li>
          )}
        </ul>
        <form id="add-task-form" onSubmit={submitForm}>
          <input className="text-input" autoComplete="off" type="text" placeholder="Type your description" id="task-name" onChange={handleInputForm} />
          <button className="btn" type="submit">Add</button>
        </form>
      </section>
    </div>
  );
}

export default App;