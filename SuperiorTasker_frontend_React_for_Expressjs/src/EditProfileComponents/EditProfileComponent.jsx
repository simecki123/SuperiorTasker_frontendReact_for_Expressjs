import './EditProfileComponentStyle.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../services/api';

function EditProfileComponent() {
    const [loading, setLoading] = useState(false);
    // Deffault user
    const [user, setUser] = useState({
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        description: '',
        image: '',
    });

    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser({
                id: storedUser.id,
                firstName: storedUser.firstName,
                lastName: storedUser.lastName,
                email: storedUser.email,
                password: storedUser.password,
                description: storedUser.description,
                image: storedUser.image,
            });
        } else {
            navigate('/');
        }
    }, [navigate]);

    // Detect change that user changed some value in input fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    // Update User
    const handleSave = async () => {
        try {
            setLoading(true);
            
            await updateUser(user.id, user);
            localStorage.setItem('user', JSON.stringify(user));
            setLoading(false);
            navigate('/mainpage');
        } catch (error) {
            setLoading(false);
            console.error('Failed to save profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    };

    // Loading ...
    if (loading) return <div className='loading-screen'><div className='loader'></div>Loading...</div>;

    return (
        <div className="edit-profile-screen-container">
            <div className="edit-profile-user-info-container">
                <h2 className='edit-profile-name-title'>First Name:</h2>
                <input
                    className="edit-profile-enter-name-user-input"
                    placeholder="Enter your first name..."
                    name="firstName"
                    value={user.firstName}
                    onChange={handleChange}
                />

                <h2 className='edit-profile-name-title'>Last Name:</h2>
                <input
                    className="edit-profile-enter-name-user-input"
                    placeholder="Enter your last name..."
                    name="lastName"
                    value={user.lastName}
                    onChange={handleChange}
                />

                <h2 className='edit-profile-name-title'>Description:</h2>
                <textarea
                    className='description-edit-profile'
                    placeholder='Enter description...'
                    name="description"
                    value={user.description}
                    onChange={handleChange}
                />

                <h2 className='edit-profile-name-title'>Profile Picture URL:</h2>
                <input
                    className="edit-profile-enter-name-user-input"
                    placeholder="Enter URL for your profile picture..."
                    name="image"
                    value={user.image}
                    onChange={handleChange}
                />
            </div>
            <button className="save-btn-edit-profile" onClick={handleSave}>SAVE</button>
        </div>
    );
}

export default EditProfileComponent;
