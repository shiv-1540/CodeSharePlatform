// SignIn.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const SignIn = ({ onSignIn }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Convert formData to JSON string
      });
  
      const data = await response.json(); // Parse the JSON response
      
      if (response.ok) {
        console.log('User signed in: ', data);
        onSignIn(); // Update the logged-in state
        navigate('/'); // Redirect to home on successful sign-in
      } 
      else {
        alert('Wrong credentials!'); // Show alert for wrong credentials
        console.log('Error signing in: ', data.message || 'Unknown error');
      }
    } catch (err) {
      console.log('Error signing in: ', err.message);
    }
  };
  
  return (
    <div className="main-container">
      <div className="form-container">
        <h1>Sign In</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input type="text" id="username" name="username" placeholder='Username' value={formData.username} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input type="password" id="password" name="password" placeholder='Password' value={formData.password} onChange={handleChange} required />
          </div>
          <input type="submit" value="Sign In" className='submit-btn' />
        </form>
      </div>
    </div>
  );
};

export default SignIn;
