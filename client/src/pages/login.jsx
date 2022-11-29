import LoginForm from "../components/LoginForm";
import { validator } from "../services/validator";
import { useNavigate } from "react-router-dom";

export const Login = () => {
	const navigate = useNavigate();
	validator().then((response) => {
		if (response.data === 'valid') {
			navigate('/home')
		}
	});

	return (
		<>
			<LoginForm />
		</>
	);
};
