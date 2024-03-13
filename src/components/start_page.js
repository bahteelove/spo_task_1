import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import './style/StartPage.css'; // Import CSS file for styling

const StartPage = () => {
  const navigate = useNavigate();

  const goPatience = () => {
    navigate("/patient")
  }

  const goDoctor = () => {
    navigate("/doctor")
  }

  return (
    <div className="start-page">
      
      <h1>Welcome to the online hospital system</h1>
      <div className="buttons-container">
        <button onClick={ goPatience } className="button"> Patient </button>
        <button onClick={ goDoctor } className="button"> Doctor </button>
      </div>

    </div>
  );
}

export default StartPage;
