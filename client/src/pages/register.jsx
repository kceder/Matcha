import RegisterForm from "../components/RegisterForm"
import { validator } from "../services/validator";
import LoginContext from "../contexts/loginContext";
import { useNavigate } from "react-router-dom";

export const Register = () => {
	const navigate = useNavigate();
	validator().then((response) => {
		console.log((response.data))
		if (response.data === 'token invalid' || response.data === 'no token') {
			navigate('/')
		}
	});
	return <RegisterForm />
}