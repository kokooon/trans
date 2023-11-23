//app.js
import React from 'react';
import {Navbar} from './component/Navbar.tsx';
import { UseForm } from './component/UseForm.tsx';
import './styles/index.css';

const App: React.FC = () => {
  return (
    <div>
      <Navbar></Navbar>
      <UseForm />
    </div>
  )
};

export default App;
