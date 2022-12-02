import PersonalDetailsForm from "../components/completeAccountForms/PersonalDetailsForm"
import { validator } from "../services/validator";
import { useNavigate } from "react-router-dom";
import { checkActiStat } from "../services/users";

export const SetUpProfile = () => {
	const navigate = useNavigate();
	validator().then((response) => {
		if (response.data === 'token invalid' || response.data === 'no token') {
			navigate('/')
		} 
		else {
			checkActiStat().then((response) => {
				if (response.data.acti_stat === 2)
					navigate('/completeaccount/photos')
				else if (response.data.acti_stat === 3)
					navigate('/profile')
			})
		}
	});
	return <PersonalDetailsForm />
}