// src/App.js
import React from 'react';
import Calendar from './Calendar';
import { data } from './data';

function App() {
  return (
    <div className="App">
      <h1>My App</h1>
      <Calendar data={data} /> {/* data prop Calendar component ko pass kar rahe hain */}
    </div>
  );
}

export default App;
