import './ButtonSaveComponentStyle.css';
import PropTypes from 'prop-types';

function ButtonSaveComponent({ handleSave }) {
    return (
        <>
            <div className='save-button-body'>
                <hr />
                <div className="save-all">
                    <button className='save-btn' onClick={handleSave}>SAVE</button>
                </div>
            </div>
        </>
    );
}

ButtonSaveComponent.propTypes = {
    handleSave: PropTypes.func.isRequired,
};

export default ButtonSaveComponent;
