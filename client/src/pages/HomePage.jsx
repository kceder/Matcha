import { useEffect, useState } from "react";
import { getUser } from "../services/users";
import { getUserPhotos } from "../services/photos";
import UsersGallery from "../components/UsersGallery";
import SearchFilter from "../components/SearchFilter";
import { getAllTags } from "../services/tags";


const HomePage = () => {
	
	useEffect(() => {
		getUser({target: "self"}).then((response) => {
			console.log(response.data.basicInfo)
			const user = response.data.basicInfo;
			calculateAge(user.birthday);
			setGender(user.gender)
			setPreference(user.preference);
			setTags(user.interests.replace(/\[|\]|\"/g, '').split(','));
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
	const [sorting, setSorting] = useState('distance')

	const [rating, setRating] = useState(0);
	const states = {
		users,
		distance,
		minAge,
		maxAge,
		tags,
		rating,
		allTags,
		sorting,
		gender,
		preference,
		setDistance,
		setMinAge,
		setMaxAge,
		setTags,
		setRating,
		setSorting,
		setUsers,
	}
	
	return (
		<div>
			<SearchFilter states={states}/>
			{/* <UsersGallery users={1}/> */}
		</div>
	);
}

export default HomePage;