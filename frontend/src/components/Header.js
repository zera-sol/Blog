import React, { useEffect, useContext} from 'react';
import { Link, useLocation} from 'react-router-dom';
import {userContext} from "./userContext"
import './Header.css';

const Header = () => {
  const {userInfo, setUserInfo} = useContext(userContext);
  const firstName = userInfo.name && userInfo.name.split(' ')[0];
  const location = useLocation();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('https://blog-one-sandy-79.vercel.app/users/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUserInfo(data.data);
        } else {
          setUserInfo({}); // Clear userName if response is not ok
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchUserProfile();
  }, [location]);

  const logout = async () => {
    try {
      await fetch('https://blog-one-sandy-79.vercel.app/users/logout', {
        credentials: 'include',
        method: 'POST',
      });
      setUserInfo({}); // Clear userInfo on logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/"><h1>Blog</h1></Link>
      </div>
      <nav>
        <ul>
          {userInfo.name ? (
            <>
              <li>
                <Link to="/create-post"><button>Create New Post</button></Link>
              </li>
              <li>
                <button onClick={logout}>Logout ({firstName})</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/register">Register</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
