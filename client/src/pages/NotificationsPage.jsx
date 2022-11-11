import { useState, useContext } from "react";
import { validator } from "../services/validator";
import LoginContext from "../contexts/loginContext";
import { useNavigate } from "react-router-dom";
import Notification from "../components/Notification";
import { useEffect } from "react";
import { getNofications, setNotificationsRead } from "../services/notifications";

const NotificationsPage = () => {
	const [login, setLogin] = useContext(LoginContext);
	const Navigate = useNavigate();
	const [notificationsElements, setNotificationsElements] = useState([]);

	useEffect(() => {
		validator().then((response) => {
			console.log((response.data))
			if (response.data === 'token invalid')
				Navigate('/')
			else
				setLogin(true)
		})
		
	}, [])

	useEffect(() => {
		getNofications().then(response => {
			setNotificationsElements( 
				response.data.map(element => {
					return <Notification key={element.id} props={element} />
				})
			)
		})
	}, [])

	useEffect(() => {
		setNotificationsRead().then(response => {
			console.log(response)
		})
	}, [])

	return (
		<div className="p-3">
			<h3>Notifications</h3>
			{notificationsElements.length === 0 ? <p>No notifications</p> : notificationsElements}
		</div>
	);
};

export default NotificationsPage;