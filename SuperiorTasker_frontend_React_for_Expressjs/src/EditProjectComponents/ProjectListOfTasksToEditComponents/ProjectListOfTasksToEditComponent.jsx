import './ProjectListOfTasksToEditStyle.css';
import PropTypes from 'prop-types';


function ProjectListOfTasksToEditComponent({ taskList, addTask, moveTaskUp, newTaskTitle, setNewTaskTitle, moveTaskDown, deleteTask }) {
    return (
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
                <button className='add-button-create-new-project' onClick={addTask}>Add Task</button>
            </div>
            <hr />

            <ol className='todo-list-create-project-unordered-list'>
                {taskList.map(task => (
                    <li className='todo-list-create-project-list' key={task._id}>
                        <span className='text-create-new-project-task-title'>{task.name}</span>
                        <div className='button-for-tasks-container'>
                            <button className='text-create-new-project-task-delete-button' onClick={() => deleteTask(task._id)}>Delete</button>
                            <button className='text-create-new-project-task-move-button' onClick={() => moveTaskUp(task._id)}>☝</button>
                            <button className='text-create-new-project-task-move-button' onClick={() => moveTaskDown(task._id)}>👇</button>
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
}

ProjectListOfTasksToEditComponent.propTypes = {
    taskList: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
        userId: PropTypes.string.isRequired,
        projectId: PropTypes.string.isRequired,
        done: PropTypes.bool.isRequired
    })).isRequired,
    addTask: PropTypes.func.isRequired,
    moveTaskUp: PropTypes.func.isRequired,
    newTaskTitle: PropTypes.string.isRequired,
    setNewTaskTitle: PropTypes.func.isRequired,
    moveTaskDown: PropTypes.func.isRequired,
    deleteTask: PropTypes.func.isRequired
};

export default ProjectListOfTasksToEditComponent;
