import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { validator } from "../services/validator";
import LoginContext from "../contexts/loginContext";
import { useNavigate } from "react-router-dom";

export const ChatPage = () => {
	
	const [login, setLogin] = useContext(LoginContext);
	const navigate = useNavigate();

	useEffect(() => {
		validator().then((response) => {
			console.log('lol', response.data)
			if (response.data === 'token invalid')
				navigate('/')
			else if (response.data === 'valid') {
				setLogin(true);
				console.log('bishh got validated');
			}
	
		})
	}, []);


	return (
		<>
			achiiiiiii
		</>
	);
};