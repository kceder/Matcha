import ProfileCard from "./ProfileCard";
import { useState } from "react";
import { useEffect } from "react";


const SortOptions = ({ setSorting}) => {
	const handleSort = (e) => {
		console.log('cgh')
		setSorting(e.target.value)
	}
	return (
		<div style={{marginRigh: '0px'}}>
			<button value={'age'} onClick={(e) =>  handleSort(e)}>Sort by Age</button>
			<button value={'distance'} onClick={(e) =>  handleSort(e)}>Sort by Distance</button>
			<button value={'tags'} onClick={(e) =>  handleSort(e)}>Sort by Tags</button>
			<button value={'score'} onClick={(e) =>  handleSort(e)}>Sort by Rating</button>
		</div>
	)
}
// check  use context
const UsersGallery = ({ users }) => {
	const [sorting, setSorting] = useState('distance')

	const sortedUsers = users.sort((a, b) => {
		if (sorting === "age") {
			return a.age - b.age;
		} else if (sorting === "distance") {
			return a.distance - b.distance;
		} else if (sorting === "score") {
			return a.score - b.score;
		} else if (sorting === "tags") {
			return a.commontags	- b.commontags;
		}
	})
	console.log("sorted users", sortedUsers)
	let filteredUsers = [];
	useEffect ((filteredUsers) => {
		filteredUsers = sortedUsers.map(user => {
			return <ProfileCard target={user.id} />
		}) 
	}, [sorting])

	return (

		<>
			<SortOptions setSorting={setSorting}/>
			{filteredUsers}
		</>
	)
}

export default UsersGallery;