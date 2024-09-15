// src/App.js
import React from 'react';
import {Routes, Route } from 'react-router-dom';
import {UserContextProvider} from "./components/userContext"
import Register from './pages/Register';
import Login from './pages/Login';
import Header from './components/Header';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import PostPage from "./pages/PostPage";
import EditPost from "./pages/EditPost"

function App() {
  return (
    <UserContextProvider>
      <Header />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path='/create-post' element ={<CreatePost />} />
          <Route path='/post/:id' element={<PostPage />} />
          <Route path='/edit-post/:id' element={<EditPost />} />
        </Routes>
      </div>
    </UserContextProvider>
  );
}

// Create a simple Home component or import it if you have one

export default App;
