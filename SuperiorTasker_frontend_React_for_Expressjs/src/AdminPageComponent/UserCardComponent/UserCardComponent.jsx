import PropTypes from 'prop-types';
import './UserCardComponent.css';

function UserCardComponent({ user, handleDeleteUser, handleUpdateUsersRole }) {
    return (
        <div className="UserCardContainer">
            <div className="user-card-details-container">
                <img className="user-card-image" src={user.image} alt={`${user.firstName} ${user.lastName}`} />
                <div className="user-card-info">
                    <span className="user-card-text">{user.firstName} {user.lastName}</span>
                    <span className='user-card-role-text'>{user.role}</span>
                </div>
            </div>
            <div className="user-card-actions">
                <button className="user-card-update-user-role" onClick={() => handleUpdateUsersRole(user._id)}>Change Role</button>
                <button className="user-card-delete-button" onClick={() => handleDeleteUser(user._id)}>Delete</button>
            </div>
        </div>
    );
}

UserCardComponent.propTypes = {
    user: PropTypes.shape({
        _id: PropTypes.number.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
    }).isRequired,
    handleDeleteUser: PropTypes.func.isRequired,
    handleUpdateUsersRole: PropTypes.func.isRequired,
};

export default UserCardComponent;