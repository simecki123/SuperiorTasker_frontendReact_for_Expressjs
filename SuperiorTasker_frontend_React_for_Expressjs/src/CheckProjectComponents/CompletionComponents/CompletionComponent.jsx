import './CompletionComponentStyle.css';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

function CompletionComponent({ taskList }) {
    const [completionPercentage, setCompletionPercentage] = useState(0);

    useEffect(() => {
        // Calculate the completion percentage based on the number of completed tasks
        const completedTasks = taskList.filter(task => task.done);
        const percentage = (completedTasks.length / taskList.length) * 100;
        setCompletionPercentage(percentage);
    }, [taskList]);

    return (
        <>
            <div className="completion-bar">
                <h1 className="completion-bar-title">Task Completion</h1>
                <div className="myProgress">
                    <div className="myBar" style={{ width: `${completionPercentage}%` }}>
                        {`${completionPercentage.toFixed(2)}%`}
                    </div>
                </div>
            </div>
        </>
    );
}

CompletionComponent.propTypes = {
    taskList: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            projectId: PropTypes.string.isRequired,
            userId: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            done: PropTypes.bool.isRequired,
        })
    ).isRequired,
};

export default CompletionComponent;
