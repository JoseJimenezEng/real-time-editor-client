import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import dotenv from 'dotenv';
dotenv.config();

const socket = io(process.env.REACT_APP_SERVER_URL);
console.log(process.env.REACT_APP_SERVER_URL)
function App() {
  const [text, setText] = useState('');
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      socket.emit('join room', { username, room });
    }

    socket.on('text update', (newText) => {
      setText(newText);
    });

    socket.on('room data', (users) => {
      setUsers(users);
    });

    return () => {
      socket.off('text update');
      socket.off('room data');
    };
  }, [isLoggedIn]);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    socket.emit('text update', { text: newText, room });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username && room) {
      setIsLoggedIn(true);
    }
  };

  return (
    <div className="d-flex">
      {isLoggedIn ? (
        <>
          <div className="bg-light p-3" style={{ width: '300px', height: '100vh' }}>
            <h4>Users in Room</h4>
            <ul>
              {users.map((user) => (
                <li key={user.id}>{user.username}</li>
              ))}
            </ul>
          </div>
          <div className="p-3" style={{ flex: 1 }}>
              <div className="formControl d-flex justify-content-around">
              <div className="mb-3">
              <label className="form-label">Font Size</label>
              <select
                className="form-select"
                onChange={(e) => {
                  document.querySelector('textarea').style.fontSize = e.target.value + 'px';
                }}
              >
                <option value="14">14px</option>
                <option value="26">26px</option>
                <option value="38">38px</option>
                <option value="40">40px</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Font Color</label>
              <input
                type="color"
                className="form-control"
                onChange={(e) => {
                  document.querySelector('textarea').style.color = e.target.value;
                }}
              />
            </div>
              </div>
            <textarea
              className="form-control"
              value={text}
              onChange={handleTextChange}
              rows="10"
              style={{ width: '100%' }}
            />
          </div>
        </>
      ) : (
        <div className="login d-flex justify-content-center align-items-center w-100 " style={{height: '100vh' }}>
          <div className="loginContent">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Room</label>
              <input
                type="text"
                className="form-control"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">Join Room</button>
          </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
