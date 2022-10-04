import { useParams } from "react-router-dom";
import { activateUser } from "../services/users";
import { useNavigate } from "react-router-dom";


const ActivateAccount = () => {
	const navigate = useNavigate();
	const request = {
		token: useParams().token.split('=')[1]
	}
	activateUser(request).then((response) => {
		console.log(response.data)
		if (response.data === 'user activated :)')
		{
			console.log('user activated')
			navigate('/acccount_on');
		}
	});
	return <>{request.token}</>;
}

export default ActivateAccount