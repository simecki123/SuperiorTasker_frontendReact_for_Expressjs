import './ToolBarComponentStyle.css';
import logo from '../../assets/SuperiorTasker.png';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';


function ToolBarComponent({user}) {

    const navigate = useNavigate();

    // User can logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    if (!user) {
        return null;
    }

    return(
        <>
            <div className='toolbar'>
                <div className="tool-bar-left-section">
                    <div className='tool-bar-dropdown'>
                        <button className='hamburger-btn'>
                            <div className="hamburger-container">
                                <div className="hamburger-bar"></div>
                                <div className="hamburger-bar"></div>
                                <div className="hamburger-bar"></div>
                            </div>
                        </button>
                    <div className='tool-bar-dropdown-content'>
                    <span className='tool-bar-span' onClick={handleLogout}>
                        Log out
                    </span>
                    <Link to="/mainpage">
                        <span className='tool-bar-span'>Home</span>
                    </Link>
                    </div>
                </div>
                <img src={user.image} alt='User' className='tool-bar-small-logo' />
                <h1 className='tool-bar-name-surname'>{`${user.firstName} ${user.lastName}`}</h1>
                </div>

                <div className="tool-bar-right-section">
                <div className='dropdown'>
                    <button className='settings-btn'>⚙️</button>
                    <div className='dropdown-content'>
                    <span className='tool-bar-span'>Light</span>
                    <span className='tool-bar-span'>Dark</span>
                    </div>
                </div>
                <img src={logo} alt='LOGO' className='tool-bar-small-logo' />
                </div>
            </div>
            <hr className='toolbar-break' />
        </>
    );

}

ToolBarComponent.propTypes = {
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
    }).isRequired,
  };

export default ToolBarComponent;