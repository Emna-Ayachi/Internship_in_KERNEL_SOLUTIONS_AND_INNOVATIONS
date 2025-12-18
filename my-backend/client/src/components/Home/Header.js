import { MessageCircleMore , UserRound , Settings ,  Bell} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const HeaderH = () =>{
    const navigate = useNavigate();
    return (
    <header className="p-3 border-bottom" style={{"margin-bottom": "2rem"}}>
    <div className="container">
        <div className="hstack gap-3">
        <div className="p-2 fw-bold">MyApp</div>
        <div className="vr" />
        <div className="ms-auto d-flex gap-3 align-items-center">
            <MessageCircleMore />
            <UserRound style={{ cursor: 'pointer' }} onClick={() => navigate('/calendar')} />
            <Bell style={{ cursor: 'pointer' }} onClick={()=>navigate('/notification')}/>
            <Settings style={{cursor: 'pointer'}} onClick={()=>navigate('/profile')} />
        </div>
        </div>
    </div>
    </header>
  );

}




export default HeaderH