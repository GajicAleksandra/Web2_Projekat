import { Navigate } from 'react-router-dom';
import { getCurrentUser, getUserRole, isVerified } from '../../services/AuthService';

const ProtectedRoute = (props) => {

  var token = getCurrentUser();
  var role = getUserRole();
  var verified = isVerified();

  if(token == null){
    return <Navigate to="/login" />
  }

  if(props.role != undefined && role != props.role){
    return <Navigate to="/accessdenied" />
  }

  if(props.additionalProp == "verificationRequired"){
    if(role == 2 && verified === "false"){
      return <Navigate to="/accessdenied" />
    }
  }

  return <props.Component additionalProp={props.additionalProp} />
}

export default ProtectedRoute;