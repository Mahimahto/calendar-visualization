// src/App.js
import React from 'react';
import Calendar from './Calendar';
import { data } from './data';

function App() {
  return (
    <div className="App">
      <Calendar data={data} /> {/* data prop Calendar component ko pass kar rahe hain */}
    </div>
  );
}

export default App;
