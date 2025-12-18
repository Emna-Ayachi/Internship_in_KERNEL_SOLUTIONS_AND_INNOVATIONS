import { useLocation, useNavigate } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import './Auth.css';

const AuthFlip = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === '/login';

  return (
    <div className="auth-container">
      <div className={`flip-card ${isLogin ? '' : 'flipped'}`}>
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <Login/>
            <p
              onClick={() => navigate('/signup')} 
              className="toggle-text"
            >
              Don't have an account? Create one
            </p>
          </div>
          <div className="flip-card-back">
            <Signup/>
            <p
              onClick={() => navigate('/login')} 
              className="toggle-text"
            >
              Already have an account? Login
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthFlip;
