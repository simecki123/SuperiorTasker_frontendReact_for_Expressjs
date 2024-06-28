import './EditProjectDetailsComponentStyle.css';

function EditProjectDetailsComponent({ project, handleChange }) {
    return (
        <div className="project-data-to-update">
            <h2 className="project-title-to-update">Project Title</h2>
            <input
                onChange={handleChange}
                maxLength={20}
                className="project-name-input-for-update"
                name="title"
                value={project.title}
                placeholder={"Enter project name..."}
            />

            <h2 className="project-description-to-update">Description</h2>
            <textarea
                onChange={handleChange}
                maxLength={100}
                className="project-description-name-input-for-update"
                value={project.description}
                name="description"
                placeholder="Enter project description..."
            ></textarea>

            <h2 className='project-date-to-update'>Date</h2>
            <input
                type='date'
                onChange={handleChange}
                className='project-date-input-for-update'
                name="date"
                value={project.date}
                placeholder='Enter final date here'
            />
        </div>
    );
}

export default EditProjectDetailsComponent;
