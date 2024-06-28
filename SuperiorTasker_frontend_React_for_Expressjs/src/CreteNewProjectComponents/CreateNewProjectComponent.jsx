import ToolBarComponent from '../MainpageComponents/ToolBarComponents/ToolBarComponent';
import ButtonSaveComponent from './ButtonSaveComponents/ButtonSaveComponent';
import './CreateNewProjectStyle.css';
import ProjectDetailsComponent from './ProjectDetailsComponents/ProjectDetailsComponent';
import ToDoListComponent from './ToDoListComponents/ToDoListComponent';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveProject, saveTask } from '../services/api';

function CreateNewProjectComponent() {
    const [user, setUser] = useState(null);
    const [newTaskList, setNewTaskList] = useState([]);
    const [newProject, setNewProject] = useState({
        userId: '',
        title: '',
        description: '',
        date: '',
        completion: '0%'
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUser();
    }, []);

    // Get user from local storage
    const fetchUser = async () => {
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const token = localStorage.getItem('token');

            if (!storedUser || !token) {
                navigate('/');
                return;
            }

            setUser(storedUser);
        } catch (error) {
            console.error('Failed to fetch user:', error);
            if (error.response && error.response.status === 401) {
                navigate('/');
            }
        } finally {
            setLoading(false);
        }
    };

    
    // Save new project
    const handleSave = async () => {
        if (!newProject.title.trim() || !newProject.description.trim() || !newProject.date.trim() ) {
            alert("All project fields must be filled.");
            return;
        }

        if (newProject.date.trim() === 'dd.mm.yyyy') {
            alert("Date must be in the format dd-mm-yyyy.");
            return;
        }

        if (newTaskList.length === 0) {
            alert("You must add at least one task.");
            return;
        }

        try {
            const savedProject = await saveProject(newProject);
            const projectId = savedProject.data.id;

            const tasksWithProjectId = newTaskList.map(task => ({
                ...task,
                projectId
            }));

            // Save all new tasks you created with new project
            await Promise.all(tasksWithProjectId.map(task => saveTask(task)));

            navigate('/mainpage');
        } catch (error) {
            console.error('Failed to save project and tasks:', error);
        }
    };

    if (loading) return <div className='loading-screen'><div className='loader'></div>Loading...</div>;

    return (
        <div className='main-page'>
            <div className='tool-bar'>
                <ToolBarComponent user={user} />
            </div>
            <div className='main-part'>
                <div className='project-desc'>
                    <ProjectDetailsComponent user={user} setNewProject={setNewProject} />
                </div>
                <div className='add-new-task'>
                    <ToDoListComponent user={user} newTaskList={newTaskList} setNewTaskList={setNewTaskList} />
                </div>
            </div>
            <div className="bottom-bar">
                <ButtonSaveComponent handleSave={handleSave} />
            </div>
        </div>
    );
}

CreateNewProjectComponent.propTypes = {
    user: PropTypes.object,
    newProject: PropTypes.object,
    newTaskList: PropTypes.arrayOf(PropTypes.object),
};

export default CreateNewProjectComponent;
