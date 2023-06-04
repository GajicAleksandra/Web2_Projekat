import { Navigate } from 'react-router-dom';
import { getCurrentUser, getUserRole } from '../../services/AuthService';

const ProtectedRoute = (props) => {

  var token = getCurrentUser();
  var role = getUserRole();

  if(token == null){
    return <Navigate to="/login" />
  }

  if(props.role != undefined && role != props.role){
    return <Navigate to="/accessdenied" />
  }

  return <props.Component additionalProp={props.additionalProp} />
}

export default ProtectedRoute;