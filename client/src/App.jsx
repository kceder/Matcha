import { Routes, Route } from 'react-router-dom'
import { Login } from './pages/login'
import { Register } from './pages/register'
import { SetUpProfile } from './pages/setUpProfile'

const App = () => {

	return (
		<>
			<nav>
			</nav>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/completeaccount" element={<SetUpProfile />} />
			</Routes>
		</>
	);
}

export default App;
