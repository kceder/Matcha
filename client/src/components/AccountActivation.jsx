import { useParams, useSearchParams } from "react-router-dom";
import { activateUser } from "../services/users";


const ActivateAccount = () => {
	const request = {
		token: useParams().token.split('=')[1]
	}
	activateUser(request).then((response) => {
		console.log(response)
	});
	return <>{request.token}</>;
}

export default ActivateAccount