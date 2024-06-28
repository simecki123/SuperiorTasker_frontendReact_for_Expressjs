import './ListOfTasksComponentStyle.css';
import PropTypes from 'prop-types';

function ListOfTasksComponent({ taskList, moveTaskUp, moveTaskDown, deleteTaskFunctionality, toggleTaskDone }) {
    return (
        <div className='toDoList-list-of-tasks'>
            <h1 className='todo-list-title'>To-Do List</h1>
            <hr />
            <ol className='unordered-list-todo-list-of-tasks'>
                {taskList.map(task => (
                    <li className='list-todo-list-of-tasks' key={task.id}>
                        <input 
                            type='checkbox'  
                            className='todo-list-checkbox' 
                            checked={task.done} 
                            onChange={() => toggleTaskDone(task.id)} 
                        />
                        <span className='todo-list-text'>{task.name}</span>
                        <div className='list-ofbuttons-for-manipulating-tasks'>
                            <button className='todo-list-delete-button' onClick={() => deleteTaskFunctionality(task.id)}>Delete</button>
                            <button className='todo-list-move-button' onClick={() => moveTaskUp(task.id)}>☝</button>
                            <button className='todo-list-move-button' onClick={() => moveTaskDown(task.id)}>👇</button>
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
}

ListOfTasksComponent.propTypes = {
    taskList: PropTypes.array.isRequired,
    moveTaskUp: PropTypes.func.isRequired,
    moveTaskDown: PropTypes.func.isRequired,
    deleteTaskFunctionality: PropTypes.func.isRequired,
    toggleTaskDone: PropTypes.func.isRequired,
};

export default ListOfTasksComponent;
