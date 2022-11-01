import { useEffect, useState } from "react";
import { getUser } from "../services/users";
import { getUserPhotos } from "../services/photos";
import UsersGallery from "../components/UsersGallery";
import SearchFilter from "../components/SearchFilter";
import { getAllTags } from "../services/tags";


const HomePage = () => {
	
	useEffect(() => {
		getUser({target: "self"}).then((response) => {
			const locations = response.data.locations;
			const user = response.data.basicInfo;
			calculateAge(user.birthday);
			setGender(user.gender)
			setPreference(user.preference);
			setTags(user.interests.replace(/\[|\]|\"/g, '').split(','));
			const ret = locations.user_set_location ? locations.user_set_location : (locations.gps_location ? locations.gps_location : locations.ip_location);
			setLocation(ret);
			
		})
	}, []);
	useEffect(() => {
		getAllTags().then(response => {
			setAllTags(response.data);
		})
	}, [])
	const calculateAge = (birthday) => {
		
		let birthDate = new Date(birthday);
		const today = new Date();
		
		const ageMS = today - birthDate;
		setMinAge(Math.floor(ageMS / 31536000000) - 5);
		setMaxAge(Math.floor(ageMS / 31536000000) + 5);
	}
	
	const [users, setUsers] = useState([]);
	const [distance, setDistance] = useState(20);
	const [minAge, setMinAge] = useState();
	const [maxAge, setMaxAge] = useState();
	const [gender, setGender] = useState("");
	const [preference, setPreference] = useState([]);
	const [tags, setTags] = useState([]);
	
	const [allTags, setAllTags] = useState([]);
	const [location, setLocation] = useState();

	const [rating, setRating] = useState(0);
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
	console.log(users);
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

export default HomePage;