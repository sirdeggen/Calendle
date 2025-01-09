import React from 'react';
import './layout/main.css'; // Correct the CSS file path

function App() {
  return (
    <div className="App">
      <h1>Welcome to Calendle</h1>
    </div>
  );
}

if (module.hot) {
  module.hot.accept();
}

export default App;