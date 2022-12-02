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
			if (response.data === 'token invalid' || response.data === 'no token')
				Navigate('/')
			else {
				setLogin(true)
			}
		})
	})

	useEffect(() => {
		if (login === true) {
			getNofications().then(response => {
				setNotificationsElements(
					response.data.map(element => {
						return <Notification key={element.id} props={element} />
					})
				)
			})
		}
	}, [login])

	useEffect(() => {
		if (login === true) {
			setNotificationsRead()
		}
	}, [login])

	return (
		<div className="p-3">
			{notificationsElements.length === 0 ? <h6 style={{textAlign: 'center' ,color: 'gray', marginTop : '5rem'}}>No notifications yet!</h6> : notificationsElements}
		</div>
	);
};

export default NotificationsPage;