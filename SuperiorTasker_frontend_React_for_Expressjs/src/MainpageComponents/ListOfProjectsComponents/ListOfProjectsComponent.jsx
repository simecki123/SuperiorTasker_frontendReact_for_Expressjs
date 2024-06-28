import './ListOfProjectsStyleComponent.css';
import { deleteProject, findAllTasksOfTheProject, deleteTask } from '../../services/api';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import PropTypes from 'prop-types';


function ListOfProjectsComponent({user, projectList, setProjectList}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    // Delete project and with him all his tasks.
    const handleDeleteProject = async (projectId) => {
        try {
        setLoading(true);
        // Fetch all tasks related to the project
        const response = await findAllTasksOfTheProject(projectId);
        const tasks = response.data.taskList;

        // Delete all tasks related to the project
        await Promise.all(tasks.map(task => deleteTask(task.id)));

        // Delete the project itself
        await deleteProject(projectId);

        // Remove the project from the local state
        setProjectList(prevList => prevList.filter(project => project.id !== projectId));
        setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Failed to delete project and its tasks:', error);
        }
    };

    // Manipulating list move selected project up
    const moveProjectUp = (projectId) => {
        const index = projectList.findIndex(project => project.id === projectId);
        if (index > 0) {
        const newList = [...projectList];
        const temp = newList[index];
        newList[index] = newList[index - 1];
        newList[index - 1] = temp;
        setProjectList(newList);
        }
    };

    // Manipulating list move selected project down
    const moveProjectDown = (projectId) => {
        const index = projectList.findIndex(project => project.id === projectId);
        if (index < projectList.length - 1) {
        const newList = [...projectList];
        const temp = newList[index];
        newList[index] = newList[index + 1];
        newList[index + 1] = temp;
        setProjectList(newList);
        }
    };

    // Sort list of projects by alphabet using title name
    const sortAlphabetically = () => {
        const sortedList = [...projectList].sort((a, b) => a.title.localeCompare(b.title));
        setProjectList(sortedList);
    };
    
    // Helpful function for sort by date function so we can easily sort by date
    const parseDate = (dateString) => {
        const [day, month, year] = dateString.split('.');
        return new Date(`${year}-${month}-${day}`);
    };

    // Sort by date
    const sortByDate = () => {
        const sortedList = [...projectList].sort((a, b) => parseDate(a.date) - parseDate(b.date));
        setProjectList(sortedList);
    };

    // Sort by completion. Each task has percentage of how fully its done
    const sortByCompletion = () => {
        const sortedList = [...projectList].sort((a, b) => parseFloat(b.completion) - parseFloat(a.completion));
        setProjectList(sortedList);
    };

    // Search using searchbar specific project
    const handleSearch = (e) => {
        e.preventDefault();
        const searchTermLowerCase = searchTerm.toLowerCase();
        const updatedList = projectList.filter(project => project.title.toLowerCase().includes(searchTermLowerCase));
        setProjectList(updatedList.concat(projectList.filter(project => !project.title.toLowerCase().includes(searchTermLowerCase))));
    };

    // Loading screen...
    if (loading) return <div className='loading-screen'><div className='loader'></div>Loading...</div>;

    return(
        <>
        <div className='project-part-container'>
                <div className="project-part-topnav">
                    <div className="project-part-search-container">
                        <form className="project-part-search-form" onSubmit={handleSearch}>
                            <input
                                className="project-part-search-bar"
                                type="text"
                                placeholder="Search.."
                                name="search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className="project-part-submit-button" type="submit">
                                <i className="fa-fa-search">🔍</i>
                            </button>
                        </form>
                    </div>

                    <div className="dropdown">
                        <button className="project-part-dropdown-btn">
                            Search By <i className="fa fa-caret-down"></i>
                        </button>
                        <div className="dropdown-content">
                            <span className='dropdown-content-project-part-span' onClick={sortAlphabetically}>Alphabetical</span>
                            <span className='dropdown-content-project-part-span' onClick={sortByDate}>Date</span>
                            <span className='dropdown-content-project-part-span' onClick={sortByCompletion}>Completion</span>
                        </div>
                    </div>

                    <Link to="/createnewproject">
                        <button className="project-part-create-new-project-btn">New Project</button>
                    </Link>
                </div>
                <hr className='project-part-break' />

                <div>
                <ol className='project-part-unordered-list'>
                        {projectList.map(project => (
                        <li className='project-part-list' key={project.id}>
                            <Link className='editProject' to={`/projectdetails/${project.id}`}>
                                <span className="project-part-text">{project.title}</span>
                                <span className='project-part-completion'>{project.completion}</span>
                            </Link>
                            <span className='project-part-date'>{project.date}</span>
                            <div>
                                <button className="project-part-delete-button" onClick={() => handleDeleteProject(project.id)}>Delete</button>
                                <button className="project-part-move-button" onClick={() => moveProjectUp(project.id)}>☝</button>
                                <button className="project-part-move-button" onClick={() => moveProjectDown(project.id)}>👇</button>
                            </div>
                        </li>
                        ))}
                    </ol>
                </div>
            </div>
        </>
    );
}

ListOfProjectsComponent.propTypes = {
    projectList: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        userId: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        completion: PropTypes.string.isRequired,
      })
    ).isRequired,
    setProjectList: PropTypes.func.isRequired,
  };


export default ListOfProjectsComponent;