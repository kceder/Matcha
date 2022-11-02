import { useEffect, useState } from "react";
import { getUser } from "../services/users";
import UsersGallery from "../components/UsersGallery";
import SearchFilter from "../components/SearchFilter";
import { getAllTags } from "../services/tags";
import { filterUsers } from "../services/users";
import Spinner from 'react-bootstrap/Spinner';


const HomePage = () => {
	const [users, setUsers] = useState([]);
	const [distance, setDistance] = useState(200);
	const [minAge, setMinAge] = useState();
	const [maxAge, setMaxAge] = useState();
	const [gender, setGender] = useState("");
	const [preference, setPreference] = useState([]);
	const [tags, setTags] = useState([]);
	
	const [allTags, setAllTags] = useState([]);
	const [location, setLocation] = useState(null);

	const [rating, setRating] = useState(0);
	useEffect(() => { // get user
		console.log(12)
		getUser({target: "self"}).then((response) => {
			console.log(1)
			const locations = response.data.locations;
			const user = response.data.basicInfo;
			calculateAge(user.birthday);
			setGender(user.gender)
			setPreference(user.preference);
			setTags(user.interests.replace(/\[|\]|"/g, '').split(','));
			const ret = locations.user_set_location ? locations.user_set_location : (locations.gps_location ? locations.gps_location : locations.ip_location);
			setLocation(ret);

		})
	}, []);
	useEffect(() => { // get all tags
		console.log(3)
		getAllTags().then(response => {
			setAllTags(response.data);
		})
	}, [])

	const calculateAge = (birthday) => {
		console.log('2')
		let birthDate = new Date(birthday);
		const today = new Date();
		
		const ageMS = today - birthDate;
		setMinAge(Math.floor(ageMS / 31536000000) - 5);
		setMaxAge(Math.floor(ageMS / 31536000000) + 5);
	}
	
	
	const states = {
		users,
		distance,
		minAge,
		maxAge,
		tags,
		rating,
		allTags,
		gender,
		preference,
		location,
		setDistance,
		setMinAge,
		setMaxAge,
		setTags,
		setRating,
		setUsers,
	}
	useEffect(() => { // set default filters for firtst query
		if(location){
			const filters = {
				distance: 800,
				minAge: 22,
				maxAge:	35,
				tags: tags,
				gender: gender,
				preference: preference,
				userLocation: location,
			}
			filterUsers(filters).then(response => {
				setUsers(response.data);
			})
		}
	}, [location, gender, preference, tags])
	if (users.length === 0) {
		return (
			<Spinner animation="grow" role="status">
				<span className="sr-only">Loading...</span>
			</Spinner>
		)
	} else {
		return (
			<div className="" style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				flexDirection: 'column',
			}}>
				<SearchFilter states={states}/>
				{ users ? <UsersGallery users={users}/> : null}
			</div>
		);
	}
}

export default HomePage;