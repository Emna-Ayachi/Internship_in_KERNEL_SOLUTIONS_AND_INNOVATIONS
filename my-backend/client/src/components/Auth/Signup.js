
import {useState} from 'react'
import './Auth.css'

const Signup = () => {
    const userFunction = localStorage.getItem('userFunction') || 'student';
    const [formData, setFormData] = useState({
        name : '',
        surname : '',
        email : '',
        password: '',
        confirmPassword : '',
    });
    const [errors , setErrors]= useState({});
    const handleChange = (e) => {
        setFormData({ 
        ...formData, 
        [e.target.name]: e.target.value 
        });
    };
    const validate = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Invalid email format';
        }
        if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
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
            try{
                const response = await fetch('http://localhost:5000/api/users',{
                    method : 'POST',
                    headers : {
                        'Content-Type': 'application/json'
                    },
                    body:JSON.stringify({
                        name:formData.name,
                        surname:formData.surname,
                        mail:formData.email,
                        password:formData.password,
                        function: userFunction,
                    })
                });
                const data = await response.json();
                if(response.ok){
                    alert('Signup successful!');
                    console.log('User saved:', data);
                    localStorage.setItem('userName', formData.name);
                    localStorage.setItem('userSurname', formData.surname);
                }else {
                    alert('Signup failed');
                    console.error(data);
                }
            }
            catch (error) {
                console.error('Error:', error);
            }
        
        }
        localStorage.removeItem('userFunction');
    };
    return (
        <form onSubmit={handleSubmit} className="mx-auto p-4 shadow-sm rounded" style={{ maxWidth: '400px' }}>
      <h2 className="mb-4 text-center">Sign Up</h2>

      {['name', 'surname', 'email', 'password', 'confirmPassword'].map((field, i) => (
        <div className="form-floating mb-3" key={i}>
          <input
            type={field.toLowerCase().includes('password') ? 'password' : field === 'email' ? 'email' : 'text'}
            className="form-control"
            name={field}
            id={field}
            placeholder={field}
            value={formData[field]}
            onChange={handleChange}
            required
          />
          <label htmlFor={field}>{field === 'confirmPassword' ? 'Confirm Password' : field.charAt(0).toUpperCase() + field.slice(1)}</label>
          {errors[field] && <div className="text-danger small mt-1">{errors[field]}</div>}
        </div>
      ))}

      <button type="submit" className="btn btn-primary w-100">Register</button>
    </form>
    )
}

export default Signup
