import ListOfProjectsComponent from './ListOfProjectsComponents/ListOfProjectsComponent';
import './MainPageComponentStyle.css';
import ProfileStatsComponent from './ProfileStatsComponents/ProfileStatsComponent';
import ToolBarComponent from './ToolBarComponents/ToolBarComponent';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { findAllProjects } from '../services/api';
import { useNavigate } from 'react-router-dom';

function MainPageComponent() {
    const [user, setUser] = useState(null);
    const [projectList, setProjectList] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserAndProjects();
    }, []);

    // Get user and his projects.
    // User is saved on login in local storage and we get all projects that belong to him using his id
    const fetchUserAndProjects = async () => {
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const token = localStorage.getItem('token');

            if (!storedUser || !token) {
                navigate('/');
                return;
            }

            setUser(storedUser);

            const res = await findAllProjects(storedUser.id);
            const projects = res.data.projectList;

            // Update state with fetched projects
            setProjectList(projects);

            // Store projects in local storage
            localStorage.setItem('projectList', JSON.stringify(projects));
        } catch (error) {
            console.error('Failed to fetch projects:', error);
            if (error.response && error.response.status === 401) {
                navigate('/');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Load projects from local storage if available
        const storedProjects = JSON.parse(localStorage.getItem('projectList'));
        if (storedProjects) {
            setProjectList(storedProjects);
        }
    }, []);

    console.log(projectList);

    // Loading screen...
    if (loading) return <div className='loading-screen'><div className='loader'></div>Loading...</div>;

    return (
        <div className='main-page'>
            <div className='tool-bar'>
                <ToolBarComponent user={user} />
            </div>
            <div className='main-part'>
                <div className='profile-part'>
                    <ProfileStatsComponent user={user} />
                </div>
                <div className='listOfProjects'>
                    <ListOfProjectsComponent user={user} projectList={projectList} setProjectList={setProjectList} />
                </div>
            </div>
        </div>
    );
}

MainPageComponent.propTypes = {
    user: PropTypes.object,
    projectList: PropTypes.arrayOf(PropTypes.object),
};

export default MainPageComponent;
