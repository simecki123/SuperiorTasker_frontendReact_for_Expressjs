import ToolBarComponent from '../MainpageComponents/ToolBarComponents/ToolBarComponent';
import './EditProjectComponentStyle.css';
import ProjectListOfTasksToEditComponent from './ProjectListOfTasksToEditComponents/ProjectListOfTasksToEditComponent';
import UpdateProjectAndTasksButtonComponent from './UpdateProjectAndTasksButtonComponent/UpdateProjectAndTasksButtonComponent';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProjectById, findAllTasksOfTheProject, saveTask, deleteTask as deleteTaskAPI, updateProject } from '../services/api';
import EditProjectDetailsComponent from './EditProjectDetailsComponent/EditProjectDetailsComponent';

function EditProjectComponent() {
    const [user, setUser] = useState(null);
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [taskList, setTaskList] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [newTaskTitle, setNewTaskTitle] = useState('');

    useEffect(() => {
        fetchUserAndTasks();
    }, [projectId]);  // Make sure to add projectId as a dependency

    useEffect(() => {
        if (user && project) {  // Fix the condition
            console.log("user:", user);
            console.log("project", project);
            console.log("tasks: ", taskList);
        }
    }, [user, project, taskList]);

    // Fetch user from local storage and tasks of project that is selected to be edited
    const fetchUserAndTasks = async () => {
        setLoading(true);
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const token = localStorage.getItem('token');

            if (!storedUser || !token) {
                navigate('/');
                return;
            }

            setUser(storedUser);
            console.log("projectId: " + projectId);
            if (projectId) {
                const dataProject = await getProjectById(projectId);
                setProject(dataProject.data);

                const response = await findAllTasksOfTheProject(projectId);
                console.log('response tasks: ', response);
                const tasks = response.data.taskList;

                setTaskList(tasks);

            }
        } catch (error) {
            console.error('Failed to fetch user:', error);
            navigate('/');
        }
        setLoading(false);
    };

    // Detect change that user typed for value of certain fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProject((prevProject) => ({
            ...prevProject,
            [name]: value,
        }));
    };

    // Move task up
    const moveTaskUp = (taskId) => {
        const index = taskList.findIndex(task => task.id === taskId);
        if (index > 0) {
            const newList = [...taskList];
            const temp = newList[index];
            newList[index] = newList[index - 1];
            newList[index - 1] = temp;
            setTaskList(newList);
        }
    };

    // Add new task
    const addTask = () => {
        if (!newTaskTitle.trim()) {
            return; // Do not add the task if the title is empty or only contains whitespace
        }
        const newTask = {
            id: Date.now(), // Temporary unique ID
            name: newTaskTitle,
            userId: user.id,
            projectId: project.id, // Ensure projectId is set
            done: false
        };
        setTaskList([...taskList, newTask]);
        setNewTaskTitle('');
    };

    // Move task down
    const moveTaskDown = (taskId) => {
        const index = taskList.findIndex(task => task.id === taskId);
        if (index < taskList.length - 1) {
            const newList = [...taskList];
            const temp = newList[index];
            newList[index] = newList[index + 1];
            newList[index + 1] = temp;
            setTaskList(newList);
        }
    };

    // Fully delete task
    const deleteTask = (taskId) => {
        setTaskList(taskList.filter(task => task.id !== taskId)); // Only remove from the local state
    };

    // Update entire project
    const updateProjectAndItsTasks = async () => {
        setLoading(true);

        try {
            // Fetch existing tasks from the database
            const response = await findAllTasksOfTheProject(projectId);
            const existingTasks = response.data.taskList;

            // Delete all existing tasks associated with the project
            for (const task of existingTasks) {
                await deleteTaskAPI(task.id);
            }

            // Calculate completion percentage
            let completedTasks = 0;
            taskList.forEach(task => {
                if (task.done) completedTasks++;
            });

            const completionPercentage = ((completedTasks / taskList.length) * 100).toFixed(2);
            project.completion = `${completionPercentage}%`;

            // Add tasks to the database
            for (const task of taskList) {
                const taskToSave = { ...task };
                delete taskToSave.id;  // Remove the id field to let MongoDB generate a new one
                await saveTask(taskToSave);
            }

            // Update the project
            await updateProject(projectId, project);
            navigate('/mainpage');
        } catch (error) {
            console.error('Failed to update project and its tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    // Loading...
    if (loading) return <div className='loading-screen'><div className='loader'></div>Loading...</div>;

    return (
        <div className='editProject-main-page'>
            <div className='editProject-toolbar'>
                <ToolBarComponent user={user}></ToolBarComponent>
            </div>

            <div className='project-details-and-tasks-list-details'>
                <div className='project-to-edit-details'>
                    <EditProjectDetailsComponent project={project} handleChange={handleChange}></EditProjectDetailsComponent>
                </div>

                <div className='tasks-to-edit-details'>
                    <ProjectListOfTasksToEditComponent
                        taskList={taskList}
                        addTask={addTask}
                        moveTaskUp={moveTaskUp}
                        moveTaskDown={moveTaskDown}
                        deleteTask={deleteTask}
                        newTaskTitle={newTaskTitle}
                        setNewTaskTitle={setNewTaskTitle}
                    ></ProjectListOfTasksToEditComponent>
                </div>
            </div>

            <div className='update-project-and-its-tasks'>
                <UpdateProjectAndTasksButtonComponent updateProjectAndItsTasks={updateProjectAndItsTasks}></UpdateProjectAndTasksButtonComponent>
            </div>
        </div>
    );
}

export default EditProjectComponent;
