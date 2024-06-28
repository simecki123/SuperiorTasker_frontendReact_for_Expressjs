import './ProjectDetailsComponentStyle.css';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function ProjectDetailsComponent({ project }) {

    // Loading...
    if (!project) return <div>Loading...</div>;

    return (
        <>
            <div className="project-details-desc">
                <h2 className="project-name">{project.title}</h2>

                <h3 className="project-desc-title">DESCRIPTION:</h3>

                <textarea readOnly className='description' value={project.description} />

                <p className='project-date'>{project.date}</p>

                <Link to={`/editProject/${project.id}`}>
                    <button className="edit-project-btn">Edit project</button>
                </Link>
            </div>
        </>
    );
}

ProjectDetailsComponent.propTypes = {
    project: PropTypes.shape({
        id: PropTypes.string,
        userId: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
        date: PropTypes.string,
        completion: PropTypes.string
    }),
};

export default ProjectDetailsComponent;