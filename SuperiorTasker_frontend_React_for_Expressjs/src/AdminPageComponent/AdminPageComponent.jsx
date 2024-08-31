import { useState, useEffect } from 'react';
import './AdminPageComponent.css';
import UserCardComponent from './UserCardComponent/UserCardComponent';
import ToolBarComponent from '../MainpageComponents/ToolBarComponents/ToolBarComponent';
import { useNavigate } from 'react-router-dom';
import { deleteUser, updateUserRole, fetchAllUsers} from '../services/api' // Assuming updateUserRole is defined in the API services

function AdminPageComponent() {
    const [user, setUser] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [userList, setUserList] = useState([]);
    const [filteredUserList, setFilteredUserList] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetching stored user data and token from local storage
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');
        setUser(storedUser);

        if (!storedUser || !token) {
            navigate('/');
            return;
        }

        const fetchUsers = async () => {
            setLoading(true);
            try {
                const users = await fetchAllUsers(storedUser._id);
                setUserList(users.data.allUsers);
                setFilteredUserList(users.data.allUsers); // Initializing filtered list
            } catch (error) {
                console.error("Error fetching user list:", error);
                setUserList([]);
                setFilteredUserList([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [navigate]);

    const handleSearch = (e) => {
        e.preventDefault();
        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        // Find the users that match the search term
        const matchedUsers = userList.filter(user =>
            user.firstName.toLowerCase().includes(lowerCaseSearchTerm) ||
            user.lastName.toLowerCase().includes(lowerCaseSearchTerm)
        );

        // Filter out the matched users from the full list to avoid duplicates
        const nonMatchedUsers = userList.filter(user =>
            !user.firstName.toLowerCase().includes(lowerCaseSearchTerm) &&
            !user.lastName.toLowerCase().includes(lowerCaseSearchTerm)
        );

        // Combine matched users (placed first) and non-matched users
        setFilteredUserList([...matchedUsers, ...nonMatchedUsers]);
    };

    const handleDeleteUser = async (id) => {
        setLoading(true);
        try {
            await deleteUser(id);
            const updatedUserList = userList.filter(user => user._id !== id);
            setUserList(updatedUserList);
            setFilteredUserList(updatedUserList);
        } catch (error) {
            console.log("Something happened, please try again");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUsersRole = async (id) => {
        setLoading(true);
        try {
            // Find the user by ID
            const userToUpdate = userList.find(user => user._id === id);
            if (!userToUpdate) throw new Error("User not found");

            // Toggle the role between "USER" and "ADMIN"
            const newRole = userToUpdate.role === "ADMIN" ? "USER" : "ADMIN";

            // Update the user's role through the API
            await updateUserRole(id, newRole); // Assuming this is a PATCH request

            // Update the user list with the new role
            const updatedUserList = userList.map(user =>
                user._id === id ? { ...user, role: newRole } : user
            );

            setUserList(updatedUserList);
            setFilteredUserList(updatedUserList);
        } catch (error) {
            console.log("Failed to update user role:", error);
        } finally {
            setLoading(false);
        }
    };

    // Loading screen...
    if (loading) return <div className='loading-screen'><div className='loader'></div>Loading...</div>;

    return (
        <div className="admin-page-wrapper">
            <ToolBarComponent user={user} />
            <div className='admin-page-container'>
                <h1 className="admin-page-title">User Management</h1>
                <div className="project-part-search-container">
                    <form className="project-part-search-form" onSubmit={handleSearch}>
                        <input
                            className="project-part-search-bar"
                            type="text"
                            placeholder="Search users by first or last name..."
                            name="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="project-part-submit-button" type="submit">
                            <i className="fa fa-search">🔍</i>
                        </button>
                    </form>
                </div>

                <div className="user-list-container">
                    <ul className='project-part-unordered-list'>
                        {filteredUserList.map(user => (
                            <li className='project-part-list' key={user._id}>
                                <UserCardComponent 
                                    user={user} 
                                    handleDeleteUser={handleDeleteUser} 
                                    handleUpdateUsersRole={handleUpdateUsersRole} 
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default AdminPageComponent;
