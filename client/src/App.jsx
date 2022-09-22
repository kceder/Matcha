import { Routes, Route } from 'react-router-dom'
import { Login } from './pages/login'
import { Register } from './pages/register'


const App = () => {

	return (
		<>
			<nav>
				
			</nav>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/register" element={<Register />} />
			</Routes>
		</>
	);
}

export default App;
