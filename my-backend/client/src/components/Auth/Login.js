import { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState({ function: '' });
  const userFunction = localStorage.getItem('userFunction') || 'student';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      try {
        const response = await fetch('http://localhost:5000/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mail: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          alert('Login successful!');
          localStorage.setItem('token', data.accessToken);
          const token = data.accessToken;
          console.log(token)
          const infoResponse = await fetch('http://localhost:5000/api/users/login/calendar', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!infoResponse.ok) {
            throw new Error('Failed to fetch user info');
          }
          const userData = await infoResponse.json();
          setUser({ function: userData.function });
          if (userFunction !== userData.function) {
            const updateResponse = await fetch('http://localhost:5000/api/users/login/function', {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                function: userFunction,
              }),
            });
            const updateData = await updateResponse.json();
            if (updateResponse.ok) {
              alert('Function updated successfully!');
            } else {
              alert('Function update failed');
              console.error(updateData);
            }
          }

          navigate('/home');
        } else {
          alert('Login failed');
          console.error(data);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong during login.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto p-4 shadow-sm rounded" style={{ maxWidth: '360px' }}>
      <h2 className="mb-4 text-center">Login</h2>

      <div className="form-floating mb-3">
        <input
          type="email"
          className="form-control"
          name="email"
          id="loginEmail"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <label htmlFor="loginEmail">Email address</label>
        {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
      </div>

      <div className="form-floating mb-3">
        <input
          type="password"
          className="form-control"
          name="password"
          id="loginPassword"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <label htmlFor="loginPassword">Password</label>
        {errors.password && <div className="text-danger small mt-1">{errors.password}</div>}
      </div>

      <button type="submit" className="btn btn-primary w-100">Login</button>
    </form>
  );
};

export default Login;
