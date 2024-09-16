import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Register = () => {
  const [message, setMessage] = useState("")
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

   // ignore the error message after 6s
    setTimeout(() => {
      setMessage("")
    }, 6000) 

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, email, password, confirmPassword } = formData;

    // Check if the password and confirm password match
    if (password !== confirmPassword) {
      setMessage("Password doesn't match!")
      return;
    } else {
      // Call the register API here
      try {
        const response = await fetch('https://blog-api-delta-smoky.vercel.app/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fullName, email, password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          setMessage(errorData.message)
          throw new Error(`Error: ${errorData.message || 'Unknown error'}`);
        }
        //A user who successfully registerd should be navigated to login page.
        navigate('/login', {state: {email, password}})
      } catch (error) {
        setMessage(`Fetch error: ${error}`)
        console.error('Fetch error:', error); // Log detailed error
      }
    }
  };

  return (
    <div className="auth-container">
      {message && <p className='error_message'>{message}</p>}
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <FaUser className="icon" />
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <FaEnvelope className="icon" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <FaLock className="icon" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <div className="input-group">
          <FaLock className="icon" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
