import React, { useEffect, useState } from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate, useLocation} from 'react-router-dom';
import './Auth.css';

const Login = () => {
  const [message, setMessage] = useState("")
  const location = useLocation()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  // ignore the error message after 6s
  setTimeout(() => {
      setMessage("")
  }, 6000) 

  useEffect(() => {
    if(location.state){
       setFormData({
        email: location.state.email || '',
        password: location.state.password || ''
       }) 
    }
  }, [location.state])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    // Handle login logic
    const {  email, password} = formData;
      // Call the login API here
      try {
        const response = await fetch('http://localhost:5000/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          setMessage(errorData.message)
          throw new Error(`Error: ${errorData.message || 'Unknown error'}`);
        }

        const data = await response.json();
        console.log(data.message)
        navigate('/')
        // Handle successful logging (e.g., redirect or show a success message)
      } catch (error) {
        setMessage(`Fetch error: ${error}`)
        console.error('Fetch error:', error); // Log detailed error
      }
      //redirect to the home page 
  };

  return (
    <div className="auth-container">
      {message && <p className='error_message'>{message}</p>}
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
