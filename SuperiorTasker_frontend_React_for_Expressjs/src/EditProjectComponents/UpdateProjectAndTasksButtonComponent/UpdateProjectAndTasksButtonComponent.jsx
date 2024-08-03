import './UpdateProjectAndTasksButtonStyle.css';
import PropTypes from 'prop-types';

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

UpdateProjectAndTasksButtonComponent.propTypes = {
    updateProjectAndItsTasks: PropTypes.func.isRequired
};


export default UpdateProjectAndTasksButtonComponent;
