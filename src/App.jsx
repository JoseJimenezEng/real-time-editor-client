import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('https://real-time-editor-server.onrender.com'); 

function App() {
  const [text, setText] = useState('');

  useEffect(() => {
    socket.on('text update', (newText) => {
      setText(newText);
    });

    return () => {
      socket.off('text update');
    };
  }, []);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    socket.emit('text update', newText);
  };

  return (
    <div className="App">
      <textarea
        value={text}
        onChange={handleTextChange}
        rows="10"
        cols="50"
      />
    </div>
  );
}

export default App;
