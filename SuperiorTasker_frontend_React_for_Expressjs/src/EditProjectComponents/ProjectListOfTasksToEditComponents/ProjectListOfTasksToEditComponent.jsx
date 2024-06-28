import './ProjectListOfTasksToEditStyle.css';

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
                    <li className='todo-list-create-project-list' key={task.id}>
                        <span className='text-create-new-project-task-title'>{task.name}</span>
                        <div className='button-for-tasks-container'>
                            <button className='text-create-new-project-task-delete-button' onClick={() => deleteTask(task.id)}>Delete</button>
                            <button className='text-create-new-project-task-move-button' onClick={() => moveTaskUp(task.id)}>☝</button>
                            <button className='text-create-new-project-task-move-button' onClick={() => moveTaskDown(task.id)}>👇</button>
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
}

export default ProjectListOfTasksToEditComponent;
