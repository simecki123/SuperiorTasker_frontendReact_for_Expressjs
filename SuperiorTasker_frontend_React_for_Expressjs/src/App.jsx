import {useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import './App.css'
import LoginScreen from './loginComponent/LoginComponent';
import RegisterScreen from './registerComponent/RegisterComponent';
import PropTypes from 'prop-types';
import MainPageComponent from './MainpageComponents/MainPageComponent';
import EditProfileComponent from './EditProfileComponents/EditProfileComponent';
import CreateNewProjectComponent from './CreteNewProjectComponents/CreateNewProjectComponent';
import CheckProjectComponent from './CheckProjectComponents/CheckProjectComponent';
import EditProjectComponent from './EditProjectComponents/EditProjectComponent';


function App() {
  
// Protected route so no one can get to them without token
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

    if (!token) {
      return <Navigate to="/" />;
    }

    return children;
  };




  ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired
  };

  return (
    <>
       <Router>
        <Routes>
            <Route path="/" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/mainpage" element={
              <ProtectedRoute>
                <MainPageComponent />
              </ProtectedRoute>
            } />
            <Route path='/editProfile' element={
              <ProtectedRoute>
                <EditProfileComponent />
              </ProtectedRoute>
            } />
            <Route path='/createnewproject' element={
              <ProtectedRoute>
                <CreateNewProjectComponent />
              </ProtectedRoute>
            } />

            <Route path='/projectdetails/:projectId' element={
              <ProtectedRoute>
                <CheckProjectComponent />
              </ProtectedRoute>
            } />

            <Route path='/editProject/:projectId' element={
              <ProtectedRoute>
                <EditProjectComponent />
              </ProtectedRoute>
            } />
        </Routes>
       </Router>
    </>
  )
}

export default App
