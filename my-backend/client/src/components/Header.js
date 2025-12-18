import { useNavigate } from 'react-router-dom';

const customColor = '#3da9fc';

const Header = ({ setIsLogin }) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    setIsLogin(true);
    navigate('/login');
  };

  const handleSignupClick = () => {
    setIsLogin(false);
    navigate('/signup');
  };

  return (
    <header className="p-3 border-bottom">
      <div className="container">
        <div className="hstack gap-3">
          <div className="p-2 fw-bold">MyApp</div>
          <div className="vr" />
          <button
            style={{ color: customColor, borderColor: customColor, backgroundColor: 'transparent' }}
            className="btn btn-outline-primary ms-auto"
            onClick={handleLoginClick}
            onMouseEnter={e => {
              e.target.style.backgroundColor = customColor;
              e.target.style.color = 'white';
            }}
            onMouseLeave={e => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = customColor;
            }}
          >
            Login
          </button>
          <button
            style={{ backgroundColor: customColor, borderColor: customColor, color: 'white' }}
            className="btn btn-primary"
            onClick={handleSignupClick}
            onMouseEnter={e => {
              e.target.style.backgroundColor = '#094067';
              e.target.style.borderColor = '#094067';
            }}
            onMouseLeave={e => {
              e.target.style.backgroundColor = customColor;
              e.target.style.borderColor = customColor;
            }}
          >
            Signup
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
