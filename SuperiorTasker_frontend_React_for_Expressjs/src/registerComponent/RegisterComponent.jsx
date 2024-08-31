import { useNavigate } from 'react-router-dom';
import './register.css';
import { useState } from 'react';
import { register } from '../services/api';

function RegisterScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Validate email format
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Handle submit for registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Invalid email format');
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      const res = await register({firstName: firstName, lastName: lastName, email: email, password: password, description: '', image: '', role: 'USER' });
      console.log(res);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className='register-container'>
      <div className='register-header'>
        <h1 className='register-title'>REGISTER</h1>
      </div>
      <form className='register-form' onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        <div className='register-form-group'>
          <label className='register-label'>First name: </label>
          <input className='register-input' type='text' maxLength={20} placeholder='Enter your first name' value={firstName} onChange={e => setFirstName(e.target.value)} />
        </div>

        <div className='register-form-group'>
          <label className='register-label'>Last name: </label>
          <input className='register-input' type='text' maxLength={20} placeholder='Enter your last name' value={lastName} onChange={e => setLastName(e.target.value)} />
        </div>

        <div className='register-form-group'>
          <label className='register-label'>Email: </label>
          <input className='register-input' type='email' maxLength={30} placeholder='Enter your email' value={email} onChange={e => setEmail(e.target.value)} />
        </div>

        <div className='register-form-group'>
          <label className='register-label'>Password: </label>
          <input className='register-input' type='password' maxLength={20} placeholder='Enter your password' value={password} onChange={e => setPassword(e.target.value)} />
        </div>

        <div className='register-form-group'>
          <label className='register-label'>Confirm Password: </label>
          <input className='register-input' type='password' maxLength={20} placeholder='Confirm your password' value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
        </div>

        <div className='register-btn-container'>
          <button type='submit' className='register-btn'>REGISTER</button>
        </div>
      </form>
    </div>
  );
}

export default RegisterScreen;
