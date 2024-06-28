import './CheckProjectComponentStyle.css';
import ToolBarComponent from '../MainpageComponents/ToolBarComponents/ToolBarComponent';
import ProjectDetailsComponent from './ProjectDetailsComponents/ProjectDetailsComponent';
import ListOfTasksComponent from './ListOfTasksComponents/ListOfTasksComponent';
import CompletionComponent from './CompletionComponents/CompletionComponent';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProjectById, findAllTasksOfTheProject, deleteTask, updateTask, updateProject } from '../services/api';

function CheckProjectComponent() {
    const [user, setUser] = useState(null);
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [taskList, setTaskList] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserAndTasks();
    }, []);

    useEffect(() => {
        if (user && project) {
            console.log("user:", user);
            console.log("project", project);
            console.log("tasks: ", taskList);
        }
    }, [user, project, taskList]);

    // Get user and all tasks of selected project
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
                console.log('response tasks: ', response)
                const tasks = response.data.taskList;

                setTaskList(tasks);

                // Calculate initial completion percentage
                calculateAndUpdateCompletionPercentage(tasks, dataProject.data);
            }

        } catch (error) {
            console.error('Failed to fetch user:', error);
            navigate('/');
        }
        setLoading(false);
    };

    // Calculate completion. Check total tasks that are done devided by total tasks *100
    const calculateAndUpdateCompletionPercentage = async (tasks, projectToUpdate) => {
        const completedTasks = tasks.filter(task => task.done).length;
        const completionPercentage = ((completedTasks / tasks.length) * 100).toFixed(2);
        projectToUpdate.completion = `${completionPercentage}%`;

        try {
            await updateProject(projectId, projectToUpdate);
            setProject({ ...projectToUpdate });
        } catch (error) {
            console.error('Failed to update project completion percentage:', error);
        }
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

    // Delete task
    const deleteTaskFunctionality = async (taskId) => {
        setLoading(true);
        try {
            await deleteTask(taskId);
            const newTaskList = taskList.filter(task => task.id !== taskId);
            setTaskList(newTaskList);
            calculateAndUpdateCompletionPercentage(newTaskList, project);
        } catch (error) {
            console.error('Failed to delete task:', error);
        } finally {
            setLoading(false);
        }
    };

    // Set task as done and update that task
    const toggleTaskDone = async (taskId) => {
        setLoading(true);
        const taskToUpdate = taskList.find(task => task.id === taskId);
        if (!taskToUpdate) return;

        const updatedTask = { ...taskToUpdate, done: !taskToUpdate.done };

        try {
            await updateTask(taskId, updatedTask);
            const newTaskList = taskList.map(task =>
                task.id === taskId ? updatedTask : task
            );
            setTaskList(newTaskList);
            calculateAndUpdateCompletionPercentage(newTaskList, project);
        } catch (error) {
            console.error('Failed to update task:', error);
        } finally {
            setLoading(false);
        }
    };

    // Loading...
    if (loading) return <div className='loading-screen'><div className='loader'></div>Loading...</div>;

    return (
        <>
            <div className="project-details-list-of-tasks">
                <div className="tool-bar">
                    <ToolBarComponent user={user} />
                </div>

                <div className='main-part'>
                    <div className='project-desc'>
                        <ProjectDetailsComponent project={project} />
                    </div>
                    <div className='add-new-task'>
                        <ListOfTasksComponent
                            taskList={taskList}
                            moveTaskUp={moveTaskUp}
                            moveTaskDown={moveTaskDown}
                            deleteTaskFunctionality={deleteTaskFunctionality}
                            toggleTaskDone={toggleTaskDone}
                        />
                    </div>
                </div>
                <CompletionComponent taskList={taskList} />
            </div>
        </>
    );
}

export default CheckProjectComponent;
