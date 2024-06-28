import './UpdateProjectAndTasksButtonStyle.css';

function UpdateProjectAndTasksButtonComponent({ updateProjectAndItsTasks }) {
    return (
        <div className='save-button-body'>
            <hr />
            <div className="save-all">
                <button className='save-btn' onClick={updateProjectAndItsTasks}>Update</button>
            </div>
        </div>
    );
}

export default UpdateProjectAndTasksButtonComponent;
