import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';

const socket = io("https://real-time-editor-server.onrender.com");

function App() {
  const [text, setText] = useState('');
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [fontColor, setFontColor] = useState('#000000');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderlined, setIsUnderlined] = useState(false);

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

    socket.on('font size update', (newFontSize) => {
      setFontSize(newFontSize);
    });

    socket.on('font color update', (newFontColor) => {
      setFontColor(newFontColor);
    });

    socket.on('font family update', (newFontFamily) => {
      setFontFamily(newFontFamily);
    });

    socket.on('italic update', (newIsItalic) => {
      setIsItalic(newIsItalic);
    });

    socket.on('underline update', (newIsUnderlined) => {
      setIsUnderlined(newIsUnderlined);
    });

    return () => {
      socket.off('text update');
      socket.off('room data');
      socket.off('font size update');
      socket.off('font color update');
      socket.off('font family update');
      socket.off('italic update');
      socket.off('underline update');
    };
  }, [isLoggedIn]);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    socket.emit('text update', { text: newText, room });
  };

  const handleFontSizeChange = (e) => {
    const newFontSize = e.target.value;
    setFontSize(newFontSize);
    socket.emit('font size update', { fontSize: newFontSize, room });
  };

  const handleFontColorChange = (e) => {
    const newFontColor = e.target.value;
    setFontColor(newFontColor);
    socket.emit('font color update', { fontColor: newFontColor, room });
  };

  const handleFontFamilyChange = (e) => {
    const newFontFamily = e.target.value;
    setFontFamily(newFontFamily);
    socket.emit('font family update', { fontFamily: newFontFamily, room });
  };

  const handleItalicChange = (e) => {
    const newIsItalic = e.target.checked;
    setIsItalic(newIsItalic);
    socket.emit('italic update', { isItalic: newIsItalic, room });
  };

  const handleUnderlineChange = (e) => {
    const newIsUnderlined = e.target.checked;
    setIsUnderlined(newIsUnderlined);
    socket.emit('underline update', { isUnderlined: newIsUnderlined, room });
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
                  value={fontSize}
                  onChange={handleFontSizeChange}
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
                  value={fontColor}
                  onChange={handleFontColorChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Font Family</label>
                <select
                  className="form-select"
                  value={fontFamily}
                  onChange={handleFontFamilyChange}
                >
                  <option value="Arial">Arial</option>
                  <option value="Calibri">Calibri</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Verdana">Verdana</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Italic</label>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={isItalic}
                  onChange={handleItalicChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Underline</label>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={isUnderlined}
                  onChange={handleUnderlineChange}
                />
              </div>
            </div>
            <textarea
              className="form-control"
              value={text}
              onChange={handleTextChange}
              rows="10"
              style={{
                width: '100%',
                fontSize: `${fontSize}px`,
                color: fontColor,
                fontFamily: fontFamily,
                fontStyle: isItalic ? 'italic' : 'normal',
                textDecoration: isUnderlined ? 'underline' : 'none',
              }}
            />
          </div>
        </>
      ) : (
        <div className="login d-flex justify-content-center align-items-center w-100 " style={{ height: '100vh' }}>
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