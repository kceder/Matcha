import { useParams } from "react-router-dom";
import { activateUser } from "../services/users";
import { useNavigate } from "react-router-dom";


const ActivateAccount = () => {
	const navigate = useNavigate();
	const request = {
		token: useParams().token.split('=')[1]
	}
	activateUser(request).then((response) => {
		if (response.data === 'user activated :)')
		{
			navigate('/acccount_on');
		} else {
			navigate('/')
		}
	});
	return <>{request.token}</>;
}

export default ActivateAccount