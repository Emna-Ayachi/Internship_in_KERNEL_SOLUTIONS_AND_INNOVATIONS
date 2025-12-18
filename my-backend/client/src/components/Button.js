import { useNavigate } from 'react-router-dom';
const customColor='#3da9fc';

const Button = ({ label}) =>{
    
    const navigate = useNavigate();
    const handleClick = () => {
        localStorage.setItem('userFunction', label.toLowerCase());
        navigate('/signup');
    }
    return(
        <button style={{ backgroundColor: customColor, borderColor: customColor, color: 'white' }}
                        className="btn btn-primary"
                        onMouseEnter={e => {e.target.style.backgroundColor = '#094067'; e.target.style.borderColor = '#094067';}}
                        onMouseLeave={e => {e.target.style.backgroundColor = customColor;e.target.style.borderColor = customColor;}}
                        onClick={handleClick}
                        type="button">
        {label}
        </button>
    )
}


export default Button