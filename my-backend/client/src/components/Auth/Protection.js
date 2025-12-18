import {Navigate} from 'react-router-dom';

const Protection = ({children}) =>{
    const isLogin = !!localStorage.getItem('token');
    if(!isLogin){
        return <Navigate to="/login" replace/>
    }
    return children;
}
export default Protection