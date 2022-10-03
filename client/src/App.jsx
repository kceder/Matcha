import { Routes, Route } from 'react-router-dom'
import ActivateAccount from './components/AccountActivation'
import { Login } from './pages/login'
import { Register } from './pages/register'
import { SetUpProfile } from './pages/setUpProfile'

const App = () => {

	return (
		<>
			<nav>
				wazaaaaaaaaaa
			</nav>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/completeaccount" element={<SetUpProfile />} />
				<Route path="/activateaccount/:token" element={<ActivateAccount />} />
			</Routes>
		</>
	);
}

export default App;
