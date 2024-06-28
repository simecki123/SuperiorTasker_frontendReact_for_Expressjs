import './ToDoListComponentsStyle.css';
import { useState } from 'react';
import PropTypes from 'prop-types';

function ToDoListComponent({ user, newTaskList, setNewTaskList }) {
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const handleAddTask = () => {
        if (!newTaskTitle.trim()) {
            return; // Do not add the task if the title is empty or only contains whitespace
        }
        const newTask = {
            id: newTaskList.length + 1, // This is just a temporary ID, you might want to use UUID or similar
            name: newTaskTitle,
            userId: user.id,
            projectId: '' ,// This will be set after the project is saved
            done: 'false'
        };
        setNewTaskList([...newTaskList, newTask]);
        setNewTaskTitle('');
    };

    // Delete task
    const handleDeleteTask = (taskId) => {
        setNewTaskList(newTaskList.filter(task => task.id !== taskId));
    };

    // Move task up
    const handleMoveTaskUp = (taskId) => {
        const index = newTaskList.findIndex(project => project.id === taskId);
        if (index > 0) {
        const newList = [...newTaskList];
        const temp = newList[index];
        newList[index] = newList[index - 1];
        newList[index - 1] = temp;
        setNewTaskList(newList);
        }
    };

    // Move task down
    const handleMoveTaskDown = (taskId) => {
        const index = newTaskList.findIndex(project => project.id === taskId);
        if (index < newTaskList.length - 1) {
        const newList = [...newTaskList];
        const temp = newList[index];
        newList[index] = newList[index + 1];
        newList[index + 1] = temp;
        setNewTaskList(newList);
        }
    };

    return (
        <>
            <div className='toDoList-create-new-project'>
                <h1 className='todo-list-createproject-title'>To-Do_List</h1>

                <div>
                    <input
                        className='todo-list-create-project-enter-task-input'
                        type='text'
                        placeholder='Enter a task ...'
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                    />
                    <button className='add-button-create-new-project' onClick={handleAddTask}>Add Task</button>
                </div>
                <hr />

                <ol className='todo-list-create-project-unordered-list'>
                    {newTaskList.map(task => (
                        <li className='todo-list-create-project-list' key={task.id}>
                            <span className='text-create-new-project-task-title'>{task.name}</span>
                            <div className='button-for-tasks-container'>
                                <button className='text-create-new-project-task-delete-button' onClick={() => handleDeleteTask(task.id)}>Delete</button>
                                <button className='text-create-new-project-task-move-button' onClick={() => handleMoveTaskUp(task.id)}>☝</button>
                                <button className='text-create-new-project-task-move-button' onClick={() => handleMoveTaskDown(task.id)}>👇</button>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        </>
    );
}

ToDoListComponent.propTypes = {
    user: PropTypes.object.isRequired,
    newTaskList: PropTypes.arrayOf(PropTypes.object).isRequired,
    setNewTaskList: PropTypes.func.isRequired,
};

export default ToDoListComponent;
