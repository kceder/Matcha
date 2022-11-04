import { useEffect, useState } from "react";
import { getUser } from "../services/users";
import UsersGallery from "../components/UsersGallery";
import SearchFilter from "../components/SearchFilter";
import { getAllTags } from "../services/tags";
import { filterUsers } from "../services/users";
import Spinner from 'react-bootstrap/Spinner';
import InfiniteScroll from 'react-infinite-scroll-component';


const HomePage = () => {
	const [users, setUsers] = useState([]);
	const [stars, setStars] = useState(0);
	const [distance, setDistance] = useState(200);
	const [minAge, setMinAge] = useState();
	const [maxAge, setMaxAge] = useState();
	const [gender, setGender] = useState("");
	const [preference, setPreference] = useState([]);
	const [tags, setTags] = useState([]);
	
	const [allTags, setAllTags] = useState([]);
	const [location, setLocation] = useState(null);
	const [displayUsers, setDisplayUsers] = useState([]);
	const [rating, setRating] = useState(0);
	const [sorting, setSorting] = useState('distance')
	let more = true;
	useEffect(() => { // get user

		getUser({target: "self"}).then((response) => {
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
	const getMoreUsers = () => {
		setDisplayUsers([...displayUsers, ...users.slice(displayUsers.length, displayUsers.length + 10)]);
		if (displayUsers.length < users.length - 2) {
			more = false;
		}
		return;
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
		stars,
		setDistance,
		setMinAge,
		setMaxAge,
		setTags,
		setRating,
		setUsers,
		setStars,
	}
	useEffect(() => { // set default filters for firtst query

		if(location && sorting){
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
				const temp = response.data.sort((a, b) => {
					if (sorting === "age") {
						return a.age - b.age;
					} else if (sorting === "distance") {
						return a.distance - b.distance;
					} else if (sorting === "score") {
						return b.score - a.score;
					} else if (sorting === "tags") {
						return b.commontags	- a.commontags;
					}
					return null;
				})
				setUsers(temp);
				setDisplayUsers(temp.slice(0, 10));
			})
		}
	}, [location, gender, preference, tags])
	
	useEffect(() => { // filter users

		setUsers(
			users.sort((a, b) => {
				if (sorting === "age") {
					return a.age - b.age;
				} else if (sorting === "distance") {
					return a.distance - b.distance;
				} else if (sorting === "score") {
					return b.score - a.score;
				} else if (sorting === "tags") {
					return b.commontags	- a.commontags;
				}
				return null;
			})
		)
		setDisplayUsers(users.slice(0, 10));
	}, [sorting, users])

	if (users.length === 0) {
		return (
			<div>
				<SearchFilter states={states}/>
				<Spinner animation="grow" role="status">
					<span className="sr-only">Loading...</span>
				</Spinner>
			</div>
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
				<UsersGallery setUsers={setUsers} setSorting={setSorting} displayUsers={displayUsers} users={users} setDisplayUsers={setDisplayUsers}/>
				<InfiniteScroll
					dataLength={displayUsers.length}
					next={getMoreUsers}
					hasMore={more}
					loader={<Spinner style={{textAlign: 'center'}} animation="grow" role="status">
								<span style={{textAlign: 'center'}} className="sr-only">Loading...</span>
							</Spinner>}
					endMessage={<p style={{textAlign: 'center'}}></p>}
				>
				</InfiniteScroll>
			</div>
		);
	}
}

export default HomePage;