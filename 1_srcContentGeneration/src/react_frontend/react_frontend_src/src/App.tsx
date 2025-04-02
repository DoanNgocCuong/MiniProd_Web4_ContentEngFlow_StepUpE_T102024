import React from 'react';
import { UserProfileForm } from './features/A_LearningPathGen/components/UserProfileForm';
import './features/A_LearningPathGen/components/UserProfileForm.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>English Learning Path Generator</h1>
      </header>
      
      <main>
        <UserProfileForm />
      </main>
    </div>
  );
}

export default App;
